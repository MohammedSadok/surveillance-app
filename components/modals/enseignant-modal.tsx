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
import { EnseignantSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";

const EnseignantModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const params = useParams();
  const router = useRouter();
  const { teacher } = data;

  const isModalOpen =
    isOpen && (type === "createTeacher" || type === "updateTeacher");

  const form = useForm({
    resolver: zodResolver(EnseignantSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      numero_tel: "",
      e_mail: "",
      departementId: 0,
    },
  });
  useEffect(() => {
    if (teacher) {
      form.setValue("nom", teacher.nom);
      form.setValue("prenom", teacher.prenom);
      form.setValue("departementId", teacher.departementId);
      form.setValue("e_mail", teacher.e_mail);
      form.setValue("numero_tel", teacher.numero_tel);
    } else form.setValue("departementId", parseInt(params.departementId));
  }, [teacher, form, params.departementId]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof EnseignantSchema>) => {
    try {
      if (type === "createTeacher") await axios.post("/api/enseignant", values);
      else await axios.patch(`/api/enseignant/${teacher?.id}`, values);
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
                name="nom"
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
                name="prenom"
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
                name="e_mail"
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
                name="numero_tel"
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
              {/* <FormField
                control={form.control}
                name="departementId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departement</FormLabel>
                    <Select
                      // onValueChange={field.onChange}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner le departement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departements?.map((item) => (
                          <SelectItem value={item.id.toString()} key={item.id}>
                            {item.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
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
export default EnseignantModal;
