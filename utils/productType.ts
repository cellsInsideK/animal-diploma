import type { SelectProductType } from "~/server/database/schema";

export const productTypeEnum: Record<SelectProductType[number], string> = {
  cat: 'Для кошек',
  dog: 'Для собак',
  rat: 'Для грызунов',
  toy: 'Игрушки и аксессуары',
  medicine: 'Зооаптека',
};