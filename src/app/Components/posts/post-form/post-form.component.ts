import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.sass'],
})
export class PostFormComponent implements OnInit {
  post: PostDTO;
  title: FormControl;
  description: FormControl;
  num_likes!: FormControl;
  num_dislikes!: FormControl;
  publication_date: FormControl;
  categories!: FormControl;

  postForm: FormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private postId: string | null;

  categoriesList!: CategoryDTO[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService
  ) {
    this.isValidForm = null;
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.post = new PostDTO('', '', 0, 0, new Date());
    this.isUpdateMode = false;

    this.title = new FormControl(this.post.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new FormControl(this.post.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.publication_date = new FormControl(
      formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.categories = new FormControl([]);

    // get categories by user and load multi select
    this.loadCategories();

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categories: this.categories,
    });
  }

  private async loadCategories(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      try {
        this.categoriesList = await this.categoryService.getCategoriesByUserId(
          userId
        );
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }

  async ngOnInit(): Promise<void> {
    // update
    if (this.postId) {
      this.isUpdateMode = true;
      try {
        this.post = await this.postService.getPostById(this.postId);

        this.title.setValue(this.post.title);

        this.description.setValue(this.post.description);

        this.publication_date.setValue(
          formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en')
        );

        let categoriesIds: string[] = [];
        this.post.categories.forEach((cat: CategoryDTO) => {
          categoriesIds.push(cat.categoryId);
        });

        this.categories.setValue(categoriesIds);

        this.postForm = this.formBuilder.group({
          title: this.title,
          description: this.description,
          publication_date: this.publication_date,
          categories: this.categories,
        });
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }

  private async editPost(): Promise<void> {
    if (this.postId) {
      const userId = this.localStorageService.get('user_id');
      if (userId) {
        this.post.userId = userId;
        this.editPostBackend(this.postId);
      }
    }
  }

  private async editPostBackend(postId: string): Promise<void> {
    try {
      await this.postService.updatePost(postId, this.post);
      await this.sharedService.managementToast('postFeedback', true);
      this.router.navigateByUrl('posts');
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
      await this.sharedService.managementToast(
        'postFeedback',
        false,
        error.error
      );
    }
  }

  private async createPost(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.post.userId = userId;
      try {
        await this.postService.createPost(this.post);
        await this.sharedService.managementToast('postFeedback', true);
        this.router.navigateByUrl('posts');
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
        await this.sharedService.managementToast(
          'postFeedback',
          false,
          error.error
        );
      }
    }
  }

  async savePost() {
    this.isValidForm = false;

    if (this.postForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.post = this.postForm.value;

    if (this.isUpdateMode) {
      await this.editPost();
    } else {
      await this.createPost();
    }
  }
}
