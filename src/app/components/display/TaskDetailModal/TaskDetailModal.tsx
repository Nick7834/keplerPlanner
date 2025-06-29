'use client'
import React, { useContext, useEffect, useState, useRef } from 'react'
import styles from './TaskDetailModal.module.scss';

import { FaFolder } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { GoGoal } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { BsCheckCircle } from "react-icons/bs";
import { BsCheckCircleFill } from "react-icons/bs";
import { useTaskContext } from '@/app/context/TaskContext';
import instance from '@/service';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { deleteTask, taskToday, taskWeek, updateTask } from '@/redux/slices/tasks';
import { useConfirmContext } from '@/app/context/ConfirmContext';
import Link from 'next/link';
import { Skeleton } from '@mui/material';

interface Task {
  title: string;
  done: boolean;
  pin: boolean;
  folder: string,
  folderId: string,
  _id: string
}

export const TaskDetailModal = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { todayTasks } = useSelector((state: RootState) => state.tasks)
    const { items: taskItems } = todayTasks;

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const { selectedTaskId, modalOpenTask, setModalOpenTask, setSelectedTaskId } = useTaskContext();

    const { confirmDel, setConfirmOpen, setConfirmDel } = useConfirmContext();

    const [data, setData] = useState<Task | null>(null);

    const [title, setTitle] = useState('');
    const [done, setDone] = useState(data?.done);
    const [pin, setPin] = useState(false);

    const [loading, setLoading] = useState(true);

    const inputHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = '25px';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    };

    // close modal 

    useEffect(() => {
      setSelectedTaskId(null)
    }, [data, selectedTaskId, setSelectedTaskId]);

    useEffect(() => {

      const closeKey = (e: any) => {
        if(e.key === 'Escape') {
          setModalOpenTask(false)
        }
      }
  
      document.addEventListener('keydown', closeKey);
  
      return () => {
        document.removeEventListener('keydown', closeKey);
      }
  
    }, [setModalOpenTask]);

    useEffect(() => {
      if(!modalOpenTask) return;
  
      const closeModal = (e: any) => {
        if(!modalRef.current) return;
        if(modalRef.current && !modalRef.current.contains(e.target)) {
          setModalOpenTask(false)
        }
      }
  
      document.addEventListener('click', closeModal);
  
      return () => {
        document.removeEventListener('click', closeModal);
      }
  
    }, [modalOpenTask, setModalOpenTask]);

    // get

    useEffect(() => {
      if(!selectedTaskId) return;

      const taskDetailNow = async () => {
        setLoading(true);
        try {
          const res = await instance.get(`/tasks/${selectedTaskId}`);
          setData(res.data);
          setTitle(res.data?.title); 
        } catch(err) {
          console.error('Error', err);
        } finally {
          setLoading(false);
        }
      }

      taskDetailNow();
    }, [selectedTaskId]);

    useEffect(() => {
      inputHeight()
    }, [data]);

    // patch 

    const patchTask = async (id: any) => {

      if(!data?.title.trim()) return;

      const updatedTasks = {
        title: title,
        done: data.done,
        pin: data.pin,
      }

        if (title !== data?.title) {
            try {
              await dispatch(updateTask({taskId: id, updatedTask: updatedTasks}));
            } catch (error) {
                console.error('An error occurred when updating the task:', error);
            }
        }

    }
    
    // del

    const confirmDelTaskModal = () => {
      setConfirmOpen(true);
    }

    const delTaskNow = async (id: any) => {
      try {
        dispatch(deleteTask(id));
        setModalOpenTask(false);
        setConfirmDel(false)
      } catch (error) {
        console.error('An error occurred when deleting the task!!:', error)
      }
    }

     useEffect(() => {
      if (confirmDel && modalOpenTask) {
        delTaskNow(data?._id);
      }
    }, [confirmDel]);

    // no enter 

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        if(e.shiftKey) {
          return; 
        } else {
            e.preventDefault(); 
            if (!data?.title.trim()) return;
            patchTask(data?._id); 
        }
      }
    };

    const handGoLink = () => {
      setModalOpenTask(false);
    }

    const taskAddToday = async (id: any) => {
      const nowTaskToday = taskItems.find(task => task._id === id);

      const updatedTasks = {
        done: false,
        pin: false,
        title: title
      }
  
      if(nowTaskToday) {
        try {
          await instance.delete(`/tasks/today/remove/${id}`);
          await dispatch(taskToday())
        } catch(err) {
          console.error('Failed to complete the task from today:(', err);
        }
      } else {
        try {
          await instance.post('/tasks/today/add', {taskId: id});
          await dispatch(updateTask({taskId: id, updatedTask: updatedTasks}));
          await dispatch(taskToday())
          setDone(false);
        } catch(err) {
          console.error('Couldnt add a task for today:(', err);
        }
      }
  
    } 

    useEffect(() => {
      setDone(data?.done);
    }, [data, selectedTaskId]);

    const taskCheckDone = async (id: any) => {
      const newDone = !done;
      setDone(newDone);
      const newPin = false;
      setPin(newPin);

      const updatedTasks = {
        done: newDone,
        pin: newPin,
        title: title
      }
    
      if (newDone !== data?.done || newPin !== data?.pin) {
        try {
          await dispatch(updateTask({taskId: id, updatedTask: updatedTasks}));
          await dispatch(taskToday());
        } catch (error) {
            console.error('An error occurred when updating the task:', error);
        }
      }
    }


  return (
    <div className={`${styles.taskDetailModal} ${modalOpenTask ? `${styles.openModal}` : ''}`}>

        <div ref={modalRef} className={`${styles.taskModal} ${modalOpenTask ? `${styles.openModal}` : ''} ${done ? `${styles.doneTaskModal}` : ''}`}>

            <div className={styles.top}>
              {loading ? <Skeleton variant="rounded" className='bg-[rgb(231,229,229,0.6)] dark:bg-[rgba(48,48,48,0.9)]' width={158} height={21} />
              :
              <Link onClick={handGoLink} href={`/planner/folder/${data?.folderId}`} className={styles.map}>
                <span>Мои списки</span>
                <IoIosArrowForward />
                <span>{data?.folder}</span>
               </Link> }


                <div className={styles.right}>
                    {loading ? 
                    ([...Array(3)].map((_, index) => (
                      <Skeleton key={index} variant="rounded" className='bg-[rgba(214,212,212,0.9)] dark:bg-[rgba(48,48,48,0.9)] w-[25px] h-[25px]' width={25} height={25} />
                    ))) :
                      <>
                      <button onClick={() => taskCheckDone(data?._id)}>{done ? <BsCheckCircleFill className={styles.checkActive} /> : <BsCheckCircle />}</button>
                      <button onClick={() => taskAddToday(data?._id)}><GoGoal className={`${taskItems.find(task => task._id === data?._id) ? `${styles.todayTask}` : ''}`} /></button>
                      <button onClick={confirmDelTaskModal}><FaRegTrashCan /></button>
                      </>
                  }
                  <button onClick={() => setModalOpenTask(!modalOpenTask)}><IoClose /></button>
                </div> 
            </div>

            <div className={styles.scrolls}>
              {loading ? 
                ([...Array(5)].map((_, index) => (
                  <Skeleton key={index} variant="rounded" className='bg-[rgba(214,212,212,0.9)] dark:bg-[rgba(48,48,48,0.9)] w-full max-w-full first:mt-0 mt-2' height={40} />
                ))) :
                  <textarea
                  ref={textareaRef}
                  maxLength={1000}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={() => patchTask(data?._id)}
                  onInput={inputHeight}
                  onKeyDown={handleKeyDown}
                ></textarea>
              }

              <div className={styles.categories}>
                  <button><FaFolder />{loading ? <Skeleton variant="rounded" className='bg-[rgba(214,212,212,0.9)] dark:bg-[rgba(48,48,48,0.9)]' width={82} height={17} /> : data?.folder}</button>
              </div>
            </div>

        </div>

    </div>
  )
}