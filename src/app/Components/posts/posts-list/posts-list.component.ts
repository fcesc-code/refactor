import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from 'src/app/Models/post.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.sass'],
})
export class PostsListComponent {
  posts!: PostDTO[];
  constructor(
    private postService: PostService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loadPosts();
  }

  private async loadPosts(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      try {
        this.posts = await this.postService.getPostsByUserId(userId);
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  async deletePost(postId: string): Promise<void> {
    let UIconfirmation = confirm(`Confirm delete post with id: ${postId}.`);
    if (UIconfirmation) {
      this.deletePostBackEnd(postId);
    }
  }

  async deletePostBackEnd(postId: string): Promise<void> {
    try {
      const rowsAffected = await this.postService.deletePost(postId);
      if (rowsAffected.affected > 0) {
        this.loadPosts();
      }
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }
}
