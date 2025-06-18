import React from "react";
import styles from "./MainPage.module.scss";
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";

export const MainPage = () => {
  return (
    <div className={styles.main_page}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.header_main}>
            <Link href="/">
              <Image
                src="/logo.svg"
                width={42}
                height={42}
                alt="logo"
              />
            </Link>

            <nav className={styles.header_nav}>
              <ul>
                <li>
                  <Link href="/log-in">
                    Авторизоваться <IoLogIn size={20} />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.main_block}>
          <div className="container">
            <div className={styles.block_info}>
              <h1>KeplerPlanner</h1>

              <p>Планирование, которое вдохновляет на успех!</p>

              <Link href="/log-in">
                Начать
                <IoIosArrowForward />
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.grid_section}>
          <div className="container">
            <div className={styles.grid_blocks}>
              <div className={styles.grid_grid}>
                <div className={styles.grid_block}>
                  <div className={styles.grid_text}>
                    <h2>Эффективное управление задачами в одном приложении.</h2>
                    <p>Создавай, отслеживай, заверши — легко и надёжно.</p>
                  </div>

                  <img
                    src="./grid/one.png"
                    alt="декор"
                  />
                </div>

                <div className={styles.grid_block}>
                  <div className={styles.grid_text}>
                    <h2>Освой эффективное планирование</h2>
                    <p>
                      Открой для себя KeplerPlanner: планируй, организуй,
                      добивайся успеха. Зарегистрируйся для эффективного
                      управления временем уже сегодня!
                    </p>
                  </div>

                  <img
                    src="./grid/two.png"
                    alt="декор"
                  />
                </div>

                <div className={styles.grid_block}>
                  <div className={styles.grid_text}>
                    <h2>Мгновенная эффективность</h2>
                    <p>
                      С KeplerPlanner создание, отслеживание и выполнение задач
                      становится простым и быстрым. Освободи время для
                      действительно важного — доверь детали нашему приложению.
                    </p>
                  </div>

                  <img
                    src="./grid/three.png"
                    alt="декор"
                  />
                </div>

                <div className={styles.grid_block}>
                  <div className={styles.grid_text}>
                    <h2>Современный и удобный дизайн</h2>
                  </div>

                  <img
                    src="./grid/four.png"
                    alt="декор"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} KeplerPlanner</span>
      </footer>
    </div>
  );
};
