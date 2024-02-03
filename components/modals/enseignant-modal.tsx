"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/hooks/useModalStore";
import { TeacherSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";

const TeacherModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const params = useParams();
  const router = useRouter();
  const { teacher } = data;

  const isModalOpen =
    isOpen && (type === "createTeacher" || type === "updateTeacher");

  const form = useForm({
    resolver: zodResolver(TeacherSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      phoneNumber: "",
      email: "",
      departmentId: 0,
    },
  });
  useEffect(() => {
    if (teacher) {
      form.setValue("firstName", teacher.firstName);
      form.setValue("lastName", teacher.lastName);
      form.setValue("departmentId", teacher.departmentId);
      form.setValue("email", teacher.email);
      form.setValue("phoneNumber", teacher.phoneNumber);
    } else form.setValue("departmentId", parseInt(params.departmentId));
  }, [teacher, form, params.departmentId]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof TeacherSchema>) => {
    try {
      if (type === "createTeacher") await axios.post("/api/teacher", values);
      else await axios.patch(`/api/teacher/${teacher?.id}`, values);
      form.reset();
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
      <DialogContent className="p-0 overflow-hidden text-black bg-white">
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <Input
                      disabled={isLoading}
                      placeholder="Entrez le nom de l'enseignant"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prenom</FormLabel>
                    <Input
                      disabled={isLoading}
                      placeholder="Entrez le prenom de l'enseignant"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <Input
                      type="email"
                      disabled={isLoading}
                      placeholder="Entrez le mail de l'enseignant"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero de telephone</FormLabel>
                    <Input
                      disabled={isLoading}
                      placeholder="Entrez le numero de l'enseignant"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
export default TeacherModal;
