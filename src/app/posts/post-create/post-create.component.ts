import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
    enteredContent = '';
    enteredTitle = '';
    private mode = 'create';
    private postId:string;
    post:Post;
    // @Output() postCreated = new EventEmitter<Post>();
    // Output so the event is able to be listened on others compoentents
    constructor(private postsService: PostsService, private route: ActivatedRoute) { }

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap)=>{
            if(paramMap.has('id')){
                this.mode = 'edit';
                this.postId = paramMap.get('id');
                this.postsService.getPost(this.postId).subscribe(postData =>{
                    this.post = {...postData};
                });
            }else{
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return
        }
        if(this.mode === 'create'){
            this.postsService.addPost(form.value.titleInput, form.value.contentInput);
        }else{
            this.postsService.updatePost(this.postId,form.value.titleInput, form.value.contentInput);
        }
        //    this.postCreated.emit(post);
        form.resetForm();
    }
}