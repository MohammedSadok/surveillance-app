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
import { Department, Teacher } from "@prisma/client";
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState<number | null>(null);
  const [teachers, setTeachers] = useState<Teacher[] | undefined>();
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des départements :",
          error
        );
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
        console.error(
          "Erreur lors de la récupération des enseignants :",
          error
        );
      }
    };
    if (department !== undefined) {
      fetchData();
      setSelectedTeacher(null);
    }
  }, [department]);

  const params = useParams<{ timeSlotId: string }>();
  const router = useRouter();

  const isModalOpen =
    isOpen && (type === "createExam" || type === "updateExam");
  const form = useForm({
    resolver: zodResolver(ExamSchema),
    defaultValues: {
      moduleName: "",
      options: "",
      enrolledStudentsCount: 0,
      responsibleId: 0,
      timeSlotId: parseInt(params.timeSlotId),
    },
  });
  useEffect(() => {
    if (exam) {
      form.setValue("moduleName", exam.moduleName);
      form.setValue("options", exam.options);
      form.setValue("enrolledStudentsCount", exam.enrolledStudentsCount);
      form.setValue("responsibleId", exam.responsibleId);
      form.setValue("timeSlotId", parseInt(params.timeSlotId));
    }
  }, [exam, form, params.timeSlotId]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof ExamSchema>) => {
    // const newValues = { ...values, timeSlotId: parseInt(params.timeSlotId) };
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
            Enseignant
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-6 space-y-4">
              <FormField
                control={form.control}
                name="moduleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du module</FormLabel>
                    <Input
                      disabled={isLoading}
                      placeholder="Entrez le nom du module"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Options</FormLabel>
                    <Input
                      disabled={isLoading}
                      placeholder="Entrez la liste des filières"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enrolledStudentsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre d'étudiants inscrits</FormLabel>
                    <Input
                      disabled={isLoading}
                      placeholder="Entrez le nombre d'étudiants inscrits"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                      value={field.value}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Responsable du module</FormLabel>
                <div className="grid gap-2 grid-cols-10">
                  <Select
                    onValueChange={(value) => setDepartment(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-4">
                        <SelectValue placeholder="Sélectionnez le département" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments?.length > 0 &&
                        departments.map((item) => (
                          <SelectItem value={item.id.toString()} key={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormField
                    control={form.control}
                    name="responsibleId"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-label="Charger les enseignants..."
                              aria-expanded={open}
                              className="flex-1 justify-between w-full"
                            >
                              {selectedTeacher
                                ? selectedTeacher.firstName +
                                  " " +
                                  selectedTeacher.lastName
                                : "Charger les enseignants..."}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Rechercher des enseignants..." />
                              <CommandEmpty>
                                Aucun enseignant trouvé.
                              </CommandEmpty>
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
                                      {teacher.firstName +
                                        " " +
                                        teacher.lastName}
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
