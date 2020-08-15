import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
    .pipe(map(postData => {
        return postData.posts.map(post => {
          return{...post, id: post._id}
        })
    })).subscribe((response) => {
        this.posts = response;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        console.log(response);
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/posts/'+postId)
      .subscribe(()=>{
        const updatedPost = this.posts.filter(post => post.id !==postId);
        this.posts = updatedPost;
        console.log(this.posts);
        this.postUpdated.next([...this.posts]);
      });
  }
}
