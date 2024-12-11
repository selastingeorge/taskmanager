"use client"

import React, { useState } from 'react';
import { GoCheckCircleFill, GoCircle } from "react-icons/go";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "./dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { CircleCheckBig, CircleMinus, Trash } from "lucide-react"
import { Button } from './button';


interface TaskProps {
  id:number,
  title: string;
  description?: string;
  date?: string;
  completed?: boolean,
  onStatusChange: (id: number, isChecked: boolean) => void;
  onDelete: (id: number) => void;
}

const Task: React.FC<TaskProps> = ({ id,title, description, date, completed = false, onStatusChange, onDelete }) => {
  const [deleteTask, setDeleteTask] = useState(false);
  const [checked, setChecked] = useState(completed);

  const onCheckChanged = (isChecked: boolean) => {
    setChecked(isChecked);
    onStatusChange(id, isChecked);
  }

  const handleDelete = () => {
    onDelete(id);
    setDeleteTask(false);
  };

  return (
    <div className={`relative w-full h-auto px-4 py-3 border border-l-[6px] select-none cursor-pointer flex items-start justify-start gap-3 rounded-lg hover:bg-gray-100 ${checked ? 'border-l-green-600' : ''}`}>
      <div className="relative inline-flex items-center cursor-pointer pt-1" onClick={() => onCheckChanged(!checked)}>
        <input type="checkbox" className="sr-only peer" onChange={(e) => onCheckChanged(e.target.checked)} />
        {checked ? <GoCheckCircleFill className="text-green-600 text-xl" /> : <GoCircle className="text-gray-400  text-xl" />}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-md font-semibold">{title || "Untitled Task"}</span>
        {description && <span className="text-sm text-gray-700 line-clamp-2 overflow-hidden text-ellipsis">{description}</span>}
        {date && <span className="text-xs text-gray-600 mt-1">{date}</span>}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none ms-auto">
          <div className="p-1 rounded-md border bg-white outline-none">
            <CgMoreVerticalAlt className='text-lg' />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Manage Task</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {!checked && (
            <DropdownMenuItem className="cursor-pointer" onClick={() => onCheckChanged(true)}>
              <CircleCheckBig />
              <span>Mark As Completed</span>
            </DropdownMenuItem>
          )}

          {checked && (
            <DropdownMenuItem className="cursor-pointer" onClick={() => onCheckChanged(false)}>
              <CircleMinus />
              <span>Mark As Pending</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="cursor-pointer" onClick={() => setDeleteTask(true)}>
            <Trash />
            <span>Delete</span>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>


      {
        //Delete Task Dialog
      }
      <Dialog open={deleteTask} onOpenChange={setDeleteTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription className="text-gray-700">
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button type="button" variant="destructive" className="rounded-lg px-4" onClick={()=>{handleDelete()}}>
              Delete Task
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Task;
