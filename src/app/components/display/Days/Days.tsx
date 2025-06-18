"use client";
import React, { useEffect, useState } from "react";
import styles from "./Days.module.scss";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Skeleton } from "@mui/material";

export const Days = () => {
  const [greeting, setGreeting] = useState("");
  const [randSloganDay, setRandSloganDay] = useState("");
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  const user = useSelector((state: RootState) => state.auth.data) as any;

  useEffect(() => {
    const currentGreeting = new Date();
    setCurrentDate(currentGreeting);

    const greetingText = currentGreeting.getHours();

    if (greetingText < 6) {
      setGreeting("Доброй ночи");
    } else if (greetingText < 12) {
      setGreeting("Доброе утро");
    } else if (greetingText < 18) {
      setGreeting("Добрый день");
    } else {
      setGreeting("Добрый вечер");
    }
  }, []);

  const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const slogans = [
    "Планируй успех — шаг за шагом!",
    "День с целями и уверенностью!",
    "Строй будущее задачами!",
    "Мечты в действия!",
    "Раскрой потенциал с планом!",
    "Мечтай, планируй, достигай!",
    "Лови момент с расписанием!",
    "Будь продуктивным через план!",
    "Маршрут к успеху — задачи!",
    "Питай амбиции планом!",
    "Придумай важное сегодня!",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const randomSlogan = () => {
        let randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
        setRandSloganDay(randomSlogan);
      };

      randomSlogan();
    }
  }, []);

  if (!currentDate) {
    return null;
  }

  const day = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const date = currentDate.getDate();

  return (
    <div className={styles.dates}>
      <div className={styles.days}>
        <span>{day}</span>
        <h2>{date}</h2>
        <span>{month}</span>
      </div>

      <div className={styles.text}>
        <h1 className={user?.fullName.length > 7 ? styles.big : ""}>
          {greeting},
          {user ? (
            <span> {user?.fullName}</span>
          ) : (
            <Skeleton
              className={styles.skeleton__day}
              variant="rounded"
              width={150}
              height={35}
            />
          )}
        </h1>
        <p>{randSloganDay}</p>
      </div>
    </div>
  );
};
