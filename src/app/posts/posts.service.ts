import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

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

  getPost(id:string){
    return this.http.get<any>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title);
    this.http.post<{ message: string, postId:string }>('http://localhost:3000/api/posts', postData)
      .subscribe((response) => {
        const post: Post = {id: response.postId, title, content};
        post.id = response.postId;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id:string, title:string, content: string){
    const post:Post = {id, title, content};
    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response =>{
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        
        this.router.navigate(['/']);
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
