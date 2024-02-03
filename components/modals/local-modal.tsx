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
import { LocationSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";

const LocalModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { building } = data;
  const router = useRouter();
  const isModalOpen =
    isOpen && (type === "createBuilding" || type === "updateBuilding");

  const form = useForm({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      name: "",
      size: 0,
    },
  });

  useEffect(() => {
    if (building) {
      form.setValue("name", building.name);
      form.setValue("size", building.size);
    }
  }, [building, form]);
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof LocationSchema>) => {
    try {
      if (type === "createBuilding") await axios.post("/api/locaux", values);
      else await axios.patch(`/api/locaux/${building?.id}`, values);
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
            Local
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-6 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom </FormLabel>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="Entrez le name du Local"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>La size</FormLabel>
                    <Input
                      disabled={isLoading}
                      placeholder="Entrez la size"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                      value={field.value}
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
export default LocalModal;
