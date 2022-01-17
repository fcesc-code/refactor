import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.sass'],
})
export class CategoriesListComponent {
  categories!: CategoryDTO[];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loadCategories();
  }

  private async loadCategories(): Promise<void> {
    const userId: string | null = this.localStorageService.get('user_id');
    if (userId) {
      try {
        this.categories = await this.categoryService.getCategoriesByUserId(
          userId
        );
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }

  createCategory(): void {
    this.router.navigateByUrl('/user/category/');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    let UIconfirmation = confirm(
      `Confirm delete category with id: ${categoryId}.`
    );
    if (UIconfirmation) {
      this.deleteCategoryBackend(categoryId);
    }
  }

  async deleteCategoryBackend(categoryId: string): Promise<void> {
    try {
      const rowsAffected = await this.categoryService.deleteCategory(
        categoryId
      );
      if (rowsAffected.affected > 0) {
        this.loadCategories();
      }
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }
}
