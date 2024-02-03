"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModal } from "@/hooks/useModalStore";
import { cn } from "@/lib/utils";
import { ExamSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Departement, Enseignant } from "@prisma/client";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const ExamModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { exam } = data;
  const [departments, setDepartments] = useState<Departement[]>([]);
  const [department, setDepartment] = useState<number | null>(null);
  const [teachers, setTeachers] = useState<Enseignant[] | undefined>();
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Enseignant | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (department !== null) {
          const response = await axios.get(
            `http://localhost:3000/api/departments/${department}`
          );
          setTeachers(response.data);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    if (department !== undefined) {
      fetchData();
      setSelectedTeacher(null);
    }
  }, [department]);

  const params = useParams<{ creneauId: string }>();
  const router = useRouter();

  const isModalOpen =
    isOpen && (type === "createExam" || type === "updateExam");
  const form = useForm({
    resolver: zodResolver(ExamSchema),
    defaultValues: {
      nomDeModule: "",
      filiers: "",
      studentsNumber: 0,
      responsible: 0,
      creneauId: parseInt(params.creneauId),
    },
  });
  useEffect(() => {
    if (exam) {
      form.setValue("nomDeModule", exam.nomDeModule);
      form.setValue("filiers", exam.filieres);
      form.setValue("studentsNumber", exam.nombreDetudiantInscrit);
      form.setValue("responsible", exam.enseignantId);
      form.setValue("creneauId", parseInt(params.creneauId));
    }
  }, [exam, form, params.creneauId]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof ExamSchema>) => {
    // const newValues = { ...values, creneauId: parseInt(params.creneauId) };
    try {
      if (type === "createExam") await axios.post("/api/exams", values);
      else axios.patch(`/api/exams/${exam?.id}`, values);
      form.reset();
      setSelectedTeacher(null);
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden text-black bg-white h-auto">
        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Enesignant
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-6 space-y-4">
              <FormField
                control={form.control}
                name="nomDeModule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de Module</FormLabel>
                    <Input
                      disabled={isLoading}
                      placeholder="Entrez le nom de Module"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filiers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Les Filiers</FormLabel>
                    <Input
                      disabled={isLoading}
                      placeholder="Entrez la liste des filieres"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentsNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Le nombre d'etudiants inscrit</FormLabel>
                    <Input
                      disabled={isLoading}
                      placeholder="Entrez le nombre d'etudiants inscrit"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                      value={field.value}
                      // {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Le responsable de module</FormLabel>
                <div className="grid gap-2  grid-cols-10 ">
                  <Select
                    onValueChange={(value) => setDepartment(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-4">
                        <SelectValue placeholder="Selectionner le departement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments?.map((item) => (
                        <SelectItem value={item.id.toString()} key={item.id}>
                          {item.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormField
                    control={form.control}
                    name="responsible"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-label="Load teachers..."
                              aria-expanded={open}
                              className="flex-1 justify-between w-full"
                            >
                              {selectedTeacher
                                ? selectedTeacher.nom +
                                  " " +
                                  selectedTeacher.prenom
                                : "Load teachers..."}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search teachers..." />
                              <CommandEmpty>No teacher found.</CommandEmpty>
                              <CommandGroup>
                                <ScrollArea className="h-[200px]">
                                  {teachers?.map((teacher) => (
                                    <CommandItem
                                      key={teacher.id}
                                      onSelect={() => {
                                        setSelectedTeacher(teacher);
                                        field.onChange(teacher.id);
                                        setOpen(false);
                                      }}
                                    >
                                      {teacher.nom + " " + teacher.prenom}
                                      <CheckIcon
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          field.value === teacher.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </ScrollArea>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 bg-gray-100">
              <Button disabled={isLoading}>Créer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default ExamModal;
