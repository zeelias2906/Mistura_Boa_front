import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class NgbDateBrParserFormatter extends NgbDateParserFormatter {

  parse(value: string): NgbDateStruct | null {
    if (!value) return null;
    const parts = value.trim().split('/');
    if (parts.length === 3) {
      return {
        day: +parts[0],
        month: +parts[1],
        year: +parts[2]
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    if (!date) return '';
    const day = date.day.toString().padStart(2, '0');
    const month = date.month.toString().padStart(2, '0');
    const year = date.year;
    return `${day}/${month}/${year}`;
  }
}
