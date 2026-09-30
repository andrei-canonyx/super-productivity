import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { T } from '../../t.const';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Controls that act on Enter themselves; confirming on top would double-fire.
const ENTER_HANDLING_SELECTOR =
  'button, a[href], input, textarea, select, [contenteditable="true"]';

@Component({
  selector: 'dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    TranslatePipe,
    MatDialogTitle,
    MatCheckbox,
    FormsModule,
  ],
})
export class DialogConfirmComponent {
  private readonly _matDialogRef =
    inject<MatDialogRef<DialogConfirmComponent>>(MatDialogRef);
  readonly data = inject(MAT_DIALOG_DATA);

  readonly cancelButton = viewChild<MatButton>('cancelButton');

  readonly T: typeof T = T;

  dontShowAgain = false;

  constructor() {
    // Enter confirms when no control has focus, e.g. the dialog container when
    // autoFocus is off (touch-primary devices). A focused button such as
    // Cancel handles Enter natively, so leave that to the browser.
    this._matDialogRef
      .keydownEvents()
      .pipe(takeUntilDestroyed())
      .subscribe((ev) => {
        const target = ev.target;
        if (
          ev.key !== 'Enter' ||
          ev.repeat ||
          ev.isComposing ||
          ev.defaultPrevented ||
          ev.altKey ||
          ev.ctrlKey ||
          ev.metaKey ||
          ev.shiftKey ||
          (target instanceof Element && target.closest(ENTER_HANDLING_SELECTOR))
        ) {
          return;
        }
        ev.preventDefault();
        this.close(true);
      });
  }

  close(res: boolean | string | undefined): void {
    if (this.data.showDontShowAgain) {
      this._matDialogRef.close({
        confirmed: res,
        dontShowAgain: this.dontShowAgain,
      });
    } else {
      this._matDialogRef.close(res);
    }
  }

  focusNextButton(nextButton: MatButton): void {
    const buttonElement = nextButton._elementRef.nativeElement;
    if (buttonElement) {
      buttonElement.focus();
    }
  }

  focusCancelButton(): void {
    const btn = this.cancelButton();
    if (btn) {
      btn._elementRef.nativeElement.focus();
    }
  }
}
