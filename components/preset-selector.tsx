"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { PopoverProps } from "@radix-ui/react-popover";
import * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Enseignant } from "@prisma/client";

interface TeacherSelectorProps extends PopoverProps {
  teachers: Enseignant[];
}

export function TeacherSelector({ teachers, ...props }: TeacherSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState<Enseignant>();

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load teachers..."
          aria-expanded={open}
          className="flex-1 justify-between w-[250px]"
        >
          {selectedTeacher
            ? selectedTeacher.nom + " " + selectedTeacher.prenom
            : "Load teachers..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search teachers..." />
          <CommandEmpty>No teacher found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[200px]">
              {teachers.map((teacher) => (
                <CommandItem
                  key={teacher.id}
                  onSelect={() => {
                    setSelectedTeacher(teacher);
                    setOpen(false);
                  }}
                >
                  {teacher.nom + " " + teacher.prenom}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTeacher?.id === teacher.id
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
  );
}
