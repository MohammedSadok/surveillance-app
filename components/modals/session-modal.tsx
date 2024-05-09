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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useModal } from "@/hooks/useModalStore";
import { transformTime } from "@/lib/utils";
import { SessionSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SessionModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "createSession";

  const form = useForm<z.infer<typeof SessionSchema>>({
    resolver: zodResolver(SessionSchema),
    defaultValues: {
      first: "08001000",
      second: "10001200",
      third: "14001600",
      fourth: "16001800",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof SessionSchema>) => {
    const formattedDateDebutString = format(values.startDate, "yyyy-MM-dd");
    const formattedDateFinString = format(values.endDate, "yyyy-MM-dd");
    const startDate = new Date(formattedDateDebutString);
    const endDate = new Date(formattedDateFinString);

    const formattedDate = {
      first: transformTime(values.first),
      second: transformTime(values.second),
      third: transformTime(values.third),
      fourth: transformTime(values.fourth),
      type: values.type,
      startDate: startDate,
      endDate: endDate,
    };
    try {
      await axios.post("/api/sessions", formattedDate);
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
      <DialogContent className="p-0 overflow-hidden text-black bg-white min-w-max">
        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Ajouter Session
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            <div className="px-6 space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="className=text-xs font-bold text-zinc-500">
                      Session
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type de session" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Normale d'hiver">
                          Normale d&apos;hiver
                        </SelectItem>
                        <SelectItem value="Normale de printemps">
                          Normale de printemps
                        </SelectItem>
                        <SelectItem value="Rattrapage d'hiver">
                          Rattrapage d&apos;hiver
                        </SelectItem>
                        <SelectItem value="Rattrapage de printemps">
                          Rattrapage de printemps
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="text-xs font-bold  text-zinc-500 ">
                        Date de début de session
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"}>
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Choisissez une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Date de fin de session
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"}>
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Choisissez une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="first"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        la première séance
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={8}
                          render={({ slots }: { slots: any[] }) => (
                            <>
                              <InputOTPGroup>
                                {slots.slice(0, 2).map((slot, index) => (
                                  <InputOTPSlot key={index} {...slot} />
                                ))}{" "}
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                {slots.slice(2, 4).map((slot, index) => (
                                  <InputOTPSlot key={index + 3} {...slot} />
                                ))}
                              </InputOTPGroup>
                              <Minus className="w-3" />
                              <InputOTPGroup>
                                {slots.slice(4, 6).map((slot, index) => (
                                  <InputOTPSlot key={index} {...slot} />
                                ))}{" "}
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                {slots.slice(6, 8).map((slot, index) => (
                                  <InputOTPSlot key={index + 3} {...slot} />
                                ))}
                              </InputOTPGroup>
                            </>
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="second"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        la deuxième séance
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={8}
                          render={({ slots }: { slots: any[] }) => (
                            <>
                              <InputOTPGroup>
                                {slots.slice(0, 2).map((slot, index) => (
                                  <InputOTPSlot key={index} {...slot} />
                                ))}{" "}
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                {slots.slice(2, 4).map((slot, index) => (
                                  <InputOTPSlot key={index + 3} {...slot} />
                                ))}
                              </InputOTPGroup>
                              <Minus className="w-3" />
                              <InputOTPGroup>
                                {slots.slice(4, 6).map((slot, index) => (
                                  <InputOTPSlot key={index} {...slot} />
                                ))}{" "}
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                {slots.slice(6, 8).map((slot, index) => (
                                  <InputOTPSlot key={index + 3} {...slot} />
                                ))}
                              </InputOTPGroup>
                            </>
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="third"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        la troisième séance
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={8}
                          render={({ slots }: { slots: any[] }) => (
                            <>
                              <InputOTPGroup>
                                {slots.slice(0, 2).map((slot, index) => (
                                  <InputOTPSlot key={index} {...slot} />
                                ))}{" "}
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                {slots.slice(2, 4).map((slot, index) => (
                                  <InputOTPSlot key={index + 3} {...slot} />
                                ))}
                              </InputOTPGroup>
                              <Minus className="w-3" />
                              <InputOTPGroup>
                                {slots.slice(4, 6).map((slot, index) => (
                                  <InputOTPSlot key={index} {...slot} />
                                ))}{" "}
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                {slots.slice(6, 8).map((slot, index) => (
                                  <InputOTPSlot key={index + 3} {...slot} />
                                ))}
                              </InputOTPGroup>
                            </>
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fourth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        la quatrième séance
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={8}
                          render={({ slots }: { slots: any[] }) => (
                            <>
                              <InputOTPGroup>
                                {slots.slice(0, 2).map((slot, index) => (
                                  <InputOTPSlot key={index} {...slot} />
                                ))}{" "}
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                {slots.slice(2, 4).map((slot, index) => (
                                  <InputOTPSlot key={index + 3} {...slot} />
                                ))}
                              </InputOTPGroup>
                              <Minus className="w-3" />
                              <InputOTPGroup>
                                {slots.slice(4, 6).map((slot, index) => (
                                  <InputOTPSlot key={index} {...slot} />
                                ))}{" "}
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                {slots.slice(6, 8).map((slot, index) => (
                                  <InputOTPSlot key={index + 3} {...slot} />
                                ))}
                              </InputOTPGroup>
                            </>
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="px-6 py-4 bg-gray-100 w-full">
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

export default SessionModal;
