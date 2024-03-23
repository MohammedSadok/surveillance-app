"use client";

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
import { useModal } from "@/hooks/useModalStore";
import { cn } from "@/lib/utils";
import { ExamSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Department, Teacher } from "@prisma/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { CheckIcon, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { read, utils } from "xlsx";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
type Student = {
  id: number;
  firstName: string;
  lastName: string;
};
const ExamModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { exam } = data;
  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState<number | null>(null);
  const [teachers, setTeachers] = useState<Teacher[] | undefined>();
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>();
  const params = useParams<{ timeSlotId: string }>();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/departments`
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
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/monitoring`,

            {
              departmentId: department,
              timeSlotId: parseInt(params.timeSlotId),
            }
          );
          setTeachers(response.data.freeTeachers);
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
  }, [department, isOpen, params.timeSlotId]);

  const isModalOpen = isOpen && type === "createExam";

  const form = useForm<z.infer<typeof ExamSchema>>({
    resolver: zodResolver(ExamSchema),
  });
  useEffect(() => {
    form.setValue("timeSlotId", parseInt(params.timeSlotId));
  }, [exam, form, params.timeSlotId, isOpen]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof ExamSchema>) => {
    const file = values.urlFile as File;
    const reader = new FileReader();

    reader.onload = async (event) => {
      const target = event?.target;
      if (target instanceof FileReader) {
        const binaryString = target.result as string;
        const workbook = read(binaryString, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: Student[] = utils.sheet_to_json(sheet);

        // Update newValues with the correct students data
        const newValues = {
          ...values,
          timeSlotId: parseInt(params.timeSlotId),
          students: data.slice(0, values.enrolledStudentsCount),
        };

        try {
          const response = await axios.post("/api/exams", newValues);
          if (response.data.error) {
            toast.error(response.data.error);
          }

          form.reset();
          setSelectedTeacher(null);
          router.refresh();
          onClose();
        } catch (error) {
          console.log(error);
        }
      }
    };

    reader.readAsArrayBuffer(file);
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
            Exam
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-6 space-y-4">
              <FormField
                defaultValue=""
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
                defaultValue=""
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
                defaultValue={0}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre d&apos;étudiants inscrits</FormLabel>
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
                      {departments.map((item) => (
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
              <FormField
                control={form.control}
                name="urlFile"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start space-y-2 min-w-max">
                    <FormLabel>Uploader un ficher excel</FormLabel>
                    <Input
                      accept=".xlsx, .xls"
                      type="file"
                      disabled={isLoading}
                      placeholder="Entrez le nombre d'étudiants inscrits"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="px-6 py-4 bg-gray-100">
              <Button disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Créer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExamModal;
