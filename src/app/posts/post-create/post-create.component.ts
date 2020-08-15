import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    enteredContent = '';
    enteredTitle = '';
    private mode = 'create';
    private postId: string;
    post: Post;
    isLoading: boolean = false;
    form: FormGroup;
    // @Output() postCreated = new EventEmitter<Post>();
    // Output so the event is able to be listened on others compoentents
    constructor(private postsService: PostsService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.form = new FormGroup({
            'title': new FormControl(null,
                {
                    validators: [Validators.required, Validators.minLength(3)],
                }),
            'content': new FormControl(null, {
                validators: [Validators.required]
            }),
            'image':new FormControl(null, { validators: [Validators.required]})
        });

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('id')) {
                this.mode = 'edit';
                this.postId = paramMap.get('id');
                
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.post = { id: postData._id, title: postData.title, content: postData.content };

                });
                
                this.form.setValue({ title: this.post.title, content: this.post.content });
            } else {
                this.mode = 'create';
                this.postId = null;
            };
            
        });
    }

    onImagePicked(event: Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image:file});
        this.form.get('image').updateValueAndValidity();
    }

    onAddPost() {
        if (this.form.invalid) {
            return
        }
        this.isLoading = true;
        if (this.mode === 'create') {
            this.postsService.addPost(this.form.value.title, this.form.value.content);
        } else {
            this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
        }
        //    this.postCreated.emit(post);
        this.form.reset();
    }
}