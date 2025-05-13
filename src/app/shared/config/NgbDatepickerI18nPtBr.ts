import { Injectable } from '@angular/core';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  'pt-BR': {
    weekdays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    months: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
  }
};

@Injectable()
export class NgbDatepickerI18nPtBr extends NgbDatepickerI18n {

  override getWeekdayLabel(
    weekday: number,
    width?: Exclude<Intl.DateTimeFormatOptions['weekday'], undefined>
  ): string {
    // Pode retornar o mesmo nome curto (ou usar `width` para variações como 'long', 'narrow', etc)
    return I18N_VALUES['pt-BR'].weekdays[weekday - 1];
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES['pt-BR'].weekdays[weekday - 1];
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES['pt-BR'].months[month - 1].substring(0, 3);
  }

  getMonthFullName(month: number): string {
    return I18N_VALUES['pt-BR'].months[month - 1];
  }

  getDayAriaLabel(date: import("@ng-bootstrap/ng-bootstrap").NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
