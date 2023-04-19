import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class FormatterInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const defaultDateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
    const currencyFormatter = new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'VND',
    });
    return next
      .handle()
      .pipe(
        map((r) => ({ ...r, defaultDateTimeFormatter, currencyFormatter })),
      );
  }
}
