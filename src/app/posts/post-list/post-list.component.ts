import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  // posts = [
  //   {title:'First', content: 'This is the content'},
  //   {title:'First', content: 'This is the content'},
  //   {title:'First', content: 'This is the content'},
  // ]
  @Input() posts: Post[] = [];
  //input to bind from the outside
  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
  }

}
