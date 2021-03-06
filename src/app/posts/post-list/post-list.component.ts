import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title:'First', content: 'This is the content'},
  //   {title:'First', content: 'This is the content'},
  //   {title:'First', content: 'This is the content'},
  // ]
  posts: Post[] = [];
  private postsSubscription: Subscription;
  isLoading: boolean = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isUserAuthenticated: boolean = false;
  userId: string;
  private authListenerSubscription: Subscription;
  //input to bind from the outside
  constructor(private postsService: PostsService, private authService: AuthService) { }


  ngOnInit(): void {

    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSubscription = this.postsService.getPostUpdateListener()
      .subscribe((postdata: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postdata.postCount;
        this.posts = postdata.posts;

      });
    this.isUserAuthenticated = this.authService.getIsAuth();
    console.log(this.isUserAuthenticated);
    this.authListenerSubscription = this.authService.getAuthStatusListener()
      .subscribe(response => {
        this.isUserAuthenticated = response;
        this.userId = this.authService.getUserId();
      });
    // subscribe() 3 posible arguments: function which is called when a new value is recived
  }
  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
    this.authListenerSubscription.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe((response) => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
} 
