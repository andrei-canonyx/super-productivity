import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
  MatDialogState,
} from '@angular/material/dialog';
import { EMPTY, firstValueFrom } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { DialogConfirmComponent } from './dialog-confirm.component';
import { By } from '@angular/platform-browser';

describe('DialogConfirmComponent', () => {
  let component: DialogConfirmComponent;
  let fixture: ComponentFixture<DialogConfirmComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogConfirmComponent>>;

  const createComponent = async (dialogData: any): Promise<void> => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'keydownEvents']);
    mockDialogRef.keydownEvents.and.returnValue(EMPTY);

    await TestBed.configureTestingModule({
      imports: [
        DialogConfirmComponent,
        NoopAnimationsModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('basic functionality', () => {
    beforeEach(async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
      });
    });

    it('should display title when provided', () => {
      const titleElement = fixture.debugElement.query(By.css('h1'));
      expect(titleElement).toBeTruthy();
    });

    it('should display message', () => {
      const contentElement = fixture.debugElement.query(By.css('.content'));
      expect(contentElement).toBeTruthy();
    });

    it('should show both cancel and confirm buttons by default', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBe(2);
    });

    it('should close with false when cancel is clicked', () => {
      const cancelButton = fixture.debugElement.queryAll(By.css('button'))[0];
      cancelButton.nativeElement.click();
      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('should close with true when confirm is clicked', () => {
      const confirmButton = fixture.debugElement.query(
        By.css('button[e2e="confirmBtn"]'),
      );
      confirmButton.nativeElement.click();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });
  });

  describe('hideCancelButton option', () => {
    it('should hide cancel button when hideCancelButton is true', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
        hideCancelButton: true,
      });

      const buttons = fixture.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBe(1);

      // The only button should be the confirm button
      const confirmButton = fixture.debugElement.query(
        By.css('button[e2e="confirmBtn"]'),
      );
      expect(confirmButton).toBeTruthy();
    });

    it('should show cancel button when hideCancelButton is false', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
        hideCancelButton: false,
      });

      const buttons = fixture.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBe(2);
    });

    it('should show cancel button when hideCancelButton is undefined', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
      });

      const buttons = fixture.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBe(2);
    });

    it('should still allow confirm when cancel is hidden', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
        hideCancelButton: true,
      });

      const confirmButton = fixture.debugElement.query(
        By.css('button[e2e="confirmBtn"]'),
      );
      confirmButton.nativeElement.click();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });
  });

  describe('title icon', () => {
    it('should show title icon when provided', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
        titleIcon: 'warning',
      });

      const iconElement = fixture.debugElement.query(By.css('.dialog-header-icon'));
      expect(iconElement).toBeTruthy();
    });

    it('should not show title icon when not provided', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
      });

      const iconElement = fixture.debugElement.query(By.css('.dialog-header-icon'));
      expect(iconElement).toBeFalsy();
    });
  });

  describe('showDontShowAgain option', () => {
    it('should not show checkbox when showDontShowAgain is false', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
        showDontShowAgain: false,
      });

      const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
      expect(checkbox).toBeFalsy();
    });

    it('should not show checkbox when showDontShowAgain is undefined', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
      });

      const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
      expect(checkbox).toBeFalsy();
    });

    it('should show checkbox when showDontShowAgain is true', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
        showDontShowAgain: true,
      });

      const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
      expect(checkbox).toBeTruthy();
    });

    it('should return object with dontShowAgain state when closing with showDontShowAgain enabled', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
        showDontShowAgain: true,
      });

      // Set the dontShowAgain state (cast to any since property added with feature)
      (component as any).dontShowAgain = true;
      fixture.detectChanges();

      // Click confirm button
      const confirmButton = fixture.debugElement.query(
        By.css('button[e2e="confirmBtn"]'),
      );
      confirmButton.nativeElement.click();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        confirmed: true,
        dontShowAgain: true,
      });
    });

    it('should return object with confirmed false when canceling with showDontShowAgain enabled', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
        showDontShowAgain: true,
      });

      // Click cancel button
      const cancelButton = fixture.debugElement.queryAll(By.css('button'))[0];
      cancelButton.nativeElement.click();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        confirmed: false,
        dontShowAgain: false,
      });
    });

    it('should return boolean directly when showDontShowAgain is false', async () => {
      await createComponent({
        title: 'Test Title',
        message: 'Test Message',
        showDontShowAgain: false,
      });

      const confirmButton = fixture.debugElement.query(
        By.css('button[e2e="confirmBtn"]'),
      );
      confirmButton.nativeElement.click();

      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });
  });
  describe('keyboard interaction (real MatDialog)', () => {
    let matDialog: MatDialog;

    const openDialog = async (
      cfg: MatDialogConfig = {},
    ): Promise<MatDialogRef<DialogConfirmComponent>> => {
      const ref = matDialog.open(DialogConfirmComponent, {
        data: { message: 'Delete task?' },
        ...cfg,
      });
      await firstValueFrom(ref.afterOpened());
      await new Promise((resolve) => setTimeout(resolve));
      return ref;
    };

    const getButtons = (): {
      cancel: HTMLButtonElement;
      confirm: HTMLButtonElement;
    } => {
      const buttons = Array.from(
        document.querySelectorAll<HTMLButtonElement>('dialog-confirm button'),
      );
      return {
        cancel: buttons.find((b) => b.getAttribute('e2e') !== 'confirmBtn')!,
        confirm: buttons.find((b) => b.getAttribute('e2e') === 'confirmBtn')!,
      };
    };

    const closedResultOrTimeout = (
      ref: MatDialogRef<DialogConfirmComponent>,
    ): Promise<unknown> =>
      Promise.race([
        firstValueFrom(ref.afterClosed()),
        new Promise((resolve) => setTimeout(() => resolve('STILL_OPEN'), 500)),
      ]);

    const pressKey = (target: Element, key: string, keyCode: number): void => {
      const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      Object.defineProperty(ev, 'keyCode', { get: () => keyCode });
      target.dispatchEvent(ev);
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, MatDialogModule, TranslateModule.forRoot()],
      }).compileComponents();
      matDialog = TestBed.inject(MatDialog);
    });

    afterEach(() => {
      matDialog.closeAll();
    });

    it('should focus the confirm button initially so Enter confirms', async () => {
      await openDialog();
      const { confirm } = getButtons();
      expect(document.activeElement).toBe(confirm);
    });

    it('should not use positive tabindex (breaks the focus trap wrap-around)', async () => {
      await openDialog();
      const { cancel, confirm } = getButtons();
      expect(cancel.hasAttribute('tabindex')).toBeFalse();
      expect(confirm.hasAttribute('tabindex')).toBeFalse();
    });

    it('should confirm on Enter when autoFocus is disabled (touch devices)', async () => {
      const ref = await openDialog({ autoFocus: false });
      const closedPromise = closedResultOrTimeout(ref);
      const container = document.querySelector('mat-dialog-container')!;
      expect(document.activeElement).toBe(container);

      pressKey(container, 'Enter', 13);

      expect(await closedPromise).toBe(true);
    });

    it('should not confirm on Enter when the cancel button is focused', async () => {
      const ref = await openDialog();
      const { cancel } = getButtons();
      cancel.focus();

      pressKey(cancel, 'Enter', 13);

      expect(ref.getState()).toBe(MatDialogState.OPEN);
    });

    it('should dismiss on Escape without confirming', async () => {
      const ref = await openDialog();
      const closedPromise = closedResultOrTimeout(ref);

      pressKey(getButtons().confirm, 'Escape', 27);

      expect(await closedPromise).toBeUndefined();
    });
  });
});
