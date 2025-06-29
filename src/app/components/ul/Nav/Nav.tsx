"use client";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./Nav.module.scss";

import { LuCalendarDays } from "react-icons/lu";
import { TbClipboardList } from "react-icons/tb";
import { FaRegDotCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchTasks,
  selectAllTasksCount,
  selectIncompleteTaskCount,
  selectNextSevenDaysCount,
  taskToday,
  taskWeek,
} from "@/redux/slices/tasks";

export const Nav = () => {
  const dispatch = useDispatch<AppDispatch>();
  const incompleteTaskCount = useSelector(selectIncompleteTaskCount);
  const selectAllTaskCount = useSelector(selectAllTasksCount);
  const selectNextSevenDaysCounts = useSelector(selectNextSevenDaysCount);

  useEffect(() => {
    dispatch(taskToday());
    dispatch(fetchTasks());
    dispatch(taskWeek());
  }, [dispatch]);

  const namePage = usePathname();

  const navs = useMemo(
    () => [
      {
        text: "Мой день",
        svg: <FaRegDotCircle />,
        link: "/planner/myday",
        current: incompleteTaskCount > 99 ? "99+" : incompleteTaskCount,
      },
      {
        text: "Неделя",
        svg: <LuCalendarDays />,
        link: "/planner/next_seven_days",
        current:
          selectNextSevenDaysCounts > 99 ? "99+" : selectNextSevenDaysCounts,
      },
      {
        text: "Все задачи",
        svg: <TbClipboardList />,
        link: "/planner/all_my_tasks",
        current: selectAllTaskCount > 99 ? "99+" : selectAllTaskCount,
      },
    ],
    [incompleteTaskCount, selectAllTaskCount, selectNextSevenDaysCounts]
  );

  return (
    <nav className={styles.nav}>
      <ul>
        {navs.map((el, index) => (
          <li key={index}>
            <Link
              className={`${namePage === el.link ? `${styles.activeNav}` : ""}`}
              href={el.link}
            >
              <div className={styles.text}>
                {el.svg} {el.text}
              </div>
              {el.current !== 0 && <span>{el.current}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
