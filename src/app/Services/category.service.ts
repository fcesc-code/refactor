import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CategoryDTO } from '../Models/category.dto';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'categories';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getCategoriesByUserId(userId: string): Promise<CategoryDTO[]> {
    return lastValueFrom(
      this.http.get<CategoryDTO[]>(
        'http://localhost:3000/users/categories/' + userId
      )
    );
  }

  createCategory(category: CategoryDTO): Promise<CategoryDTO> {
    return lastValueFrom(
      this.http.post<CategoryDTO>(this.urlBlogUocApi, category)
    );
  }

  getCategoryById(categoryId: string): Promise<CategoryDTO> {
    return lastValueFrom(
      this.http.get<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId)
    );
  }

  updateCategory(
    categoryId: string,
    category: CategoryDTO
  ): Promise<CategoryDTO> {
    return lastValueFrom(
      this.http.put<CategoryDTO>(
        this.urlBlogUocApi + '/' + categoryId,
        category
      )
    );
  }

  // delete category (si esta vinculada a un post no dixarem eliminar)
  deleteCategory(categoryId: string): Promise<deleteResponse> {
    return lastValueFrom(
      this.http.delete<deleteResponse>(this.urlBlogUocApi + '/' + categoryId)
    );
  }
}
