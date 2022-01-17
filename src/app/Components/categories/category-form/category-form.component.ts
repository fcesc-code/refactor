import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.sass'],
})
export class CategoryFormComponent implements OnInit {
  category: CategoryDTO;
  title: FormControl;
  description: FormControl;
  css_color: FormControl;

  categoryForm: FormGroup;

  isValidForm: boolean = false;
  private isUpdateMode: boolean;
  private categoryId: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;

    this.title = new FormControl(this.category.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new FormControl(this.category.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.css_color = new FormControl(this.category.css_color, [
      Validators.required,
      Validators.maxLength(7),
    ]);

    this.categoryForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      css_color: this.css_color,
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.categoryId) {
      this.isUpdateMode = true;
      try {
        this.category = await this.categoryService.getCategoryById(
          this.categoryId
        );

        this.title.setValue(this.category.title);
        this.description.setValue(this.category.description);
        this.css_color.setValue(this.category.css_color);

        this.categoryForm = this.formBuilder.group({
          title: this.title,
          description: this.description,
          css_color: this.css_color,
        });
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }

  private async editCategory(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    if (userId && this.categoryId) {
      this.category.userId = userId;
      this.editCategoryBackend(this.categoryId);
    }
  }

  private async editCategoryBackend(categoryId: string): Promise<void> {
    try {
      await this.categoryService.updateCategory(categoryId, this.category);
      await this.sharedService.managementToast('categoryFeedback', true);
      this.router.navigateByUrl('categories');
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
      await this.sharedService.managementToast(
        'categoryFeedback',
        false,
        error.error
      );
    }
  }

  private async createCategory(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.category.userId = userId;
      try {
        await this.categoryService.createCategory(this.category);
        await this.sharedService.managementToast('categoryFeedback', true);
        this.router.navigateByUrl('categories');
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
        await this.sharedService.managementToast(
          'categoryFeedback',
          false,
          error.error
        );
      }
    }
  }

  async saveCategory() {
    this.isValidForm = false;
    if (this.categoryForm.invalid) {
      return;
    }
    this.isValidForm = true;

    this.category = this.categoryForm.value;

    if (this.isUpdateMode) {
      await this.editCategory();
    } else {
      await this.createCategory();
    }
  }
}
