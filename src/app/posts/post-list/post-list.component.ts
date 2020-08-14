import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

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
  //input to bind from the outside
  constructor(private postsService: PostsService) {}
  

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSubscription = this.postsService.getPostUpdateListener().subscribe((posts: Post[])=>{
      this.posts = posts;
    });
    // subscribe() 3 posible arguments: function which is called when a new value is recived
  }
  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
  }
} 
