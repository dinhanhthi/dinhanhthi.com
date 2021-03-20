---
layout: post
title: "Angular 4 - Forms"
tags: ["MOOC", "JavaScript", "Angular"]
toc: true
icon: /img/header/angular.svg
keywords: "mooc course fundamental installation 101 typescript ts service logging user udemy maximilian"
---

{% assign img-url = '/img/post/angular' %}

This is my note for the course "[Angular - The Complete Guide (2021 Edition)](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/13914134#overview)" which is taught by Maximilian Schwarzmüller on Udemy. This is an incredible course for you to start to learn Angular from basic. The official Angular docs is good but it's not for the beginner.

🍄 **PART 1** — [Angular  1 - Basics & Components & Databinding & Directives](/angular-1-basics-components-databinding-directives/)
🍄 **PART 2** — [Angular 2 - Services & Dependency Injection & Routing](/angular-2-service-dependency-injection-routing/)
🍄 **PART 3** — [Angular 3 - Observable](/angular-3-observable/)
🍄 **PART 4** —  [Angular 4 - Forms](/angular-4-forms/)
👉 [Github repo](https://github.com/dinhanhthi/learn-angular-complete-guide)
👉 **Other note** (taken before this course): [Angular 101](https://www.notion.so/Angular-101-fcbd5683f8e941f89c709595792b62d2)

::: warning
This note contains only the important things which can be look back later, it cannot replace either [the course](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/13914134#overview) nor [the official document](https://angular.io/start)!
:::

## **TIPS**

👉  [Assignment example of using Forms in Angular](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/12982454#questions)  (video)+ [codes](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/3-forms-reactive-assignment-solution/src/app).
👉  Project using Form : [codes](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/4-prj-forms-final/src/app).

## Why Forms in Angular?

Because your app is SVC (single-view-component) → when you submit a form, how can web do it? → that's why angular need a special "things" for forms.

- Get input values by the users
- Check the valid of input
- Styling conditionally the form

![Angular_4_-_Forms_4258fc3ce29b46deb5f5b0492c50c7bb/Untitled.png]({{ img-url }}/angular-4/Untitled.png)
_Left: HTML form → Right: key-value object can be submitted with the form._

## 2 approaches with forms

- Template driven ← inferred from DOM (html)
- Reactive ← form created programmatically and synchronized with the DOM → more controls

## Template-driven form

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/1-forms-template-driven-final/src/app).

Everything you wanna do → do it in the template ← template-driven!!!!

### Create a TD form

The form here don't make any HTML request. ← `<form>` has no attribute!

```jsx
// make sure
// app.module.ts
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
		FormsModule // with this, angular will auto create form based on <form> in html
	]
})
export ...
```

Angular doesn't recognize auto elements of `<form>` (label, input,...) because there may be some inputs which aren't served when submitting a form (their functions are different from a function of a form but they're inside `<form>`) → ==need to tell angular which ones to be extra controlled?==

```html
<!-- app.component.ts -->
<form>
	<input type="text">        <!-- normal input (without "ngModel") -->
	<input                     <!-- tell angular to control this input -->
		type="text"
		ngModel   <!-- looks like 2-way binding, ie. [(ngModel)] -->
		name="username">  <!-- must have <- registered in JS representation of the form -->
</form>
```

### Submitting & Using the Form

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/1-forms-template-driven-final/src/app).

We can actually see what users entered.

```jsx
// If we use normal form
<form>
	<button type="submit">Submit</button> // normal behavior - sending http request
</form>
```

```jsx
// We use ngSubmit
<form (ngSubmit)="onSubmit(f)" #f="ngForm">
														//   ^Hey, get me access to this form you created
														//        automatically
	<button type="submit">Submit</button>
</form>
```

```jsx
// app.component.ts
onSubmit(form: HTMLFormElement) {
	console.log(form);
	// Get the values user entered: form.value
}
```

![Angular_4_-_Forms_4258fc3ce29b46deb5f5b0492c50c7bb/Untitled_1.png]({{ img-url }}/angular-4/Untitled_1.png)

Get the values user entered: `form.value`

### Form State

```jsx
// .html
<form (ngSubmit)="onSubmit(f)" #f="">...</form>

// .component.ts
onSubmit(form: HTMLFormElement) {
	console.log(form);
}
```

- `form.controls` → several properties to control the form.
- `form.dirty`: `true` if we changed something in the form.
- `form.invalid` / `form.valid`: if we add some invalidator  / validator (to check the fields), this can be true or false.
- Read more [in official doc](https://angular.io/api/forms/NgForm).

### Access Form via `@ViewChild()`

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/1-forms-template-driven-final/src/app).

With `#f` (local ref), we can use `@ViewChild`. ⇒ Useful when you wanna access the form not only at the time you submit it but also earlier!

```jsx
// .html
<form (ngSubmit)="onSubmit()" #f="ngForm">...</form>
											//  ^don't have "f" here

// .component.ts
export class ... {
	@ViewChild('f') signupForm: NgForm;

	onSubmit() {
		console.log(this.signupForm);
	}
}
```

### Validation

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/blob/master/15-forms/1-forms-template-driven-final/src/app/app.component.html).

```html
<form (ngSubmit)="onSubmit()" #f="ngForm">
	<input
		type="text"
		ngModel
		name="username"
		required>
<!--    ^default HTML attribute <- angular see it as a built-in directive -->

	<input
		type="email"
		ngModel
		required
		email  // angular's directive, not html attribute -> make sure it's a valid email
		#email="ngModel">
		   <!-- ^ expose some additional info abt the controls -->

	<span *ngIf="!email.valid && email.touched">Please enter valid email!</span>

	<button
		type="submit"
		[disabled]="!f.valid">Submit</button>
</form>
```

👉 [List of all built-in validators](https://angular.io/api/forms/Validators).
👉 [List of directives which can be added to your template](https://angular.io/api?type=directive).

There are 2 places for `.valid` information ← `form.valid` and `form.controls.email.valid`

When it's invalid (after clicking on submit) or valid → angular auto add classes to the html element ← we can use these class to style our element!

Enable HTML5 validation (by default, Angular disables it)  → `ngNativeValidate`

::: col-2-equal
```scss
// if user touched in input and leave
//   it but it's invalid
input.ng-invalid.ng-touched{
	...
}
```

```jsx
// patterns (eg. number > 0)
<input
	type="number"
	name="amount"
	ngModel
	pattern="^[1-9]+[0-9]*$"
>
```
:::

### Set default values

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/1-forms-template-driven-final/src/app).

Using 1-way binding / property binding (`[ngModel]`) to set the default value.

```jsx
<select
  id="secret"
  class="form-control"
  [ngModel]="defaultQuestion"
  name="secret">
  <option value="pet">Your first Pet?</option>
  <option value="teacher">Your first teacher?</option>
</select>

// component.ts
defaultQuestion = "pet";
```

### Instantly react to changes

Before, the check only performed after clicking "Submit" → If you wanna check "lively" → Using two-way binding `[(NgModel)]`

```html
<div class="form-group">
  <textarea
    name="questionAnswer"
    rows="3"
    class="form-control"
    [(ngModel)]="answer"></textarea>
</div>
<p>Your reply: {{ answer }}</p>
```

### Binding with `NgModel`

- **0-way binding**, `NgModel` → tell angular that this input is a control
- **1-way binding**, `[NgModel]` → get this control a default value
- **2-way binding**, `[(NgModel)]` → Instantly out / do whatever you want with that value

### Grouping Form Controls

In a big form, we need to "group" some values into a group  / validate some specific group of inputs.

```html
<div
	ngModelGroup="userData" <!--  ^the key name for this group -->
	#userData="NgModelGroup">
	<!-- input fields -->
</div>
<p *ngIf="!userData.valid && userData.touched">User data is invalid!</p>
```

After submit: instead of getting `form.value.email`, but getting `form.value.userData.email` (and also `form.controls.userData`)

### Radio buttons

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/1-forms-template-driven-final/src/app).

``` html
<div class="radio" *ngFor="let gender of genders">
  <label>
    <input
      type="radio"
      name="gender"
      ngModel
      [value]="gender"
      required>
    {{ gender }}
  </label>
</div>

<!-- .component.ts -->
genders = ['male', 'female'];
```

### Set values to input fields

([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656488#questions/10535928)) With [this HTML file](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/1-forms-template-driven-final/src/app),

```jsx
// .component.ts
this.signupForm.setValue({
	userData: {
	  username: suggestedName,
	  email: ''
	},
	secret: 'pet',
	questionAnswer: '',
	gender: 'male'
});
// down side -> overwrite all fields whenever we click "Suggest an Username".

// If we wanna set value TO A SINGLE ONE FIELD?
this.signupForm.form.patchValue({
						//  ^patchValue is only available with .form
  userData: {
    username: suggestedName
  }
});
```

### Using Form Data

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/1-forms-template-driven-final/src/app).

```jsx
// html
<div *ngIf="submitted">
  <h3>Your Data</h3>
  <p>Username: {{ user.username }}</p>
  <p>Mail: {{ user.email }}</p>
  <p>Secret Question: Your first {{ user.secretQuestion }}</p>
  <p>Answer: {{ user.answer }}</p>
  <p>Gender: {{ user.gender }}</p>
</div>
```

```jsx
// .component.ts
export class AppComponent {
	user = {
    username: '',
    email: '',
    secretQuestion: '',
    answer: '',
    gender: ''
  };
  submitted = false;

	onSubmit() {
    this.submitted = true;
    this.user.username = this.signupForm.value.userData.username;
    this.user.email = this.signupForm.value.userData.email;
    this.user.secretQuestion = this.signupForm.value.secret;
    this.user.answer = this.signupForm.value.questionAnswer;
    this.user.gender = this.signupForm.value.gender;

    this.signupForm.reset(); // to reset the form
  }
}
```

## Reactive Form

Create the form programmatically (not from scratch).

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/2-forms-reactive-final/src/app) + [Video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656502#questions/10535928).

### Setting up

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/2-forms-reactive-final/src/app).

- `FormGroup` → a form, in the end, it's just a group of controls.
- We don't need `FormsModule` in `app.module.ts` (it's for template-driven form) → NEED `ReactiveFormsModule`
- We don't need local reference anymore.
- We configure all things in the typescript code (`component.ts`)

```jsx
// app.module.ts
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule
  ]
})
export ...
```

```jsx
// html
<form [formGroup]="signupForm">
//     ^hey, don't treat this form as normal or create form for me, just
//        use my formgroup "signupForm" (in component.ts)
	<input
		formControlName="username">
//  ^the name given in component.ts of this input field
</form>
```

```jsx
// app.component.ts
export ... OnInit {
	signupForm: FormGroup;

	ngOnInit() {
		this.signupForm = new FormGroup({
      'username': new FormControl(null);
		// |      				|				    ^initial value
		// |              ^each field is a FormControl
		// ^the same name for "formControlName" in .html <- that's the link
    });
	}
}
```

### Grouping Controls

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/2-forms-reactive-final/src/app).

`FormGroup` inside `FormGroup`.

```jsx
// .component.ts
this.signupForm = new FormGroup({
  'userData': new FormGroup({
    'username': new FormControl(...),
    'email': new FormControl(...)
  }),
  'gender': new FormControl('male'),
});
```

```jsx
// html
// need to put 'username' and 'email' inside a div
<form [formGroup]="signupForm">
	<div formGroupName="userData">
		<input formControlName="username">

		<span *ngIf="!signupForm.get('userData.username').valid>
															//  ^new here
			Please enter a valid username!
		</span>

		<input formControlName="email">
	</div>
</form>
```

### `FormArray`

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/2-forms-reactive-final/src/app).

Let the user dynamically add their form controls (we don't know yet there are how many controls there) → using an array of form.

Get access to `FormArray`,

```jsx
// .component.ts
this.signupForm = new FormGroup({
  ...
  'hobbies': new FormArray([])
});
```

```jsx
// html
<div formArrayName="hobbies">
  <button
    (click)="onAddHobby()">Add Hobby</button>
  <div
    *ngFor="let hobbyControl of signupForm.get('hobbies').controls; let i = index">
    <input type="text" class="form-control" [formControlName]="i">
  </div>
</div>
```

```jsx
// 1st way
// .ts
getControls() {
	return (<FormArray>this.signupForm.get('hobbies')).controls;
}

// .html
*ngFor="let hobbyControl of getControls(); let i = index"
```

```jsx
// 2nd way (using getter)
// .ts
get controls() {
	return (this.signupForm.get('hobbies') as FormArray).controls;
}

// .html
*ngFor="let hobbyControl of controls; let i = index"
```

### Validation

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/2-forms-reactive-final/src/app).

```jsx
this.signupForm = new FormGroup({
  'username': new FormControl(null, Validators.required);
																					//   ^it's actually .required() but in
																					//    this case, we wanna add a ref
																					//    to this method, angular'll know
																					//    to call it whenever we make changes
	'email': new FormControl(null, [Validators.required, Validators.email]);
															// ^multiple validations
});
```

Get access directly to the FormControl using `.get()`

```jsx
<span
	*ngIf="!signupForm.get('username').valid && signupForm.get('username').touched">
	Please enter a valid username!
</span>
```

```jsx
// for the overall form
<span
	*ngIf="!signupForm.valid && signupForm.touched">
	Please enter valid data!
</span>
```

### Custom validation

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/2-forms-reactive-final/src/app).

Suppose that we don't want users use some specific names.

```jsx
// .ts
forbiddenUsernames = ['Chris', 'Anna'];

ngOnInit() {
	this.signupForm = new FormGroup({
		'username': new FormControl(
			null, [
				Validators.required,
				this.forbiddenNames.bind(this)]),
											//   ^need this 'cause angular will call .forbiddenNames()
											//    (not current class -> cannot use only "this." directly
											//    -> let angular knows (binds) to current class as "this"
	}
}

forbiddenNames(control: FormControl): {[s: string]: boolean} {
																		// ^a return type
  if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
																							//     ^return of .indexOf
																							//      (if not contains) is "-1"
    return {'nameIsForbidden': true};
  }
  return null;
		//   ^we don't return ... "false" here because for angular, returning null
		//      means "valid"
}
```

```jsx
// use error message with "nameIsForbidden"
// can use Inspect of the browser to check the location of "nameISForbidden"
<span *ngIf="signupForm.get('userData.username').errors['nameIsForbidden']">
	This name is invalid!
</span>
```

### Custom async validation

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/15-forms/2-forms-reactive-final/src/app).

([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656522#questions)) Suppose we wanna check "already-taken" emails from the server.

```jsx
this.signupForm = new FormGroup({
  'email': new FormControl(
		null, [Validators.required, Validators.email], this.forbiddenEmails)
																								// ^can be an array,
																								// this position is for async
});

forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
  const promise = new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      if (control.value === 'test@test.com') {
        resolve({'emailIsForbidden': true});
      } else {
        resolve(null);
      }
    }, 1500);
  });
  return promise;
}
```

### Form Status: `statusChanges`, `valueChanges`

`.statusChanges` → gives the status of the form (*INVALID, VALID, PENDING,...*)

`.valueChanges` → change something in the form (eg. typing something).

```jsx
ngOnInit() {
	this.signupForm.valueChanges.subscribe(
		(value) => console.log(value);
	);
}
```

### Set values to input fields

```jsx
this.signupForm.setValue({
  'userData': {
    'username': 'Max',
    'email': 'max@test.com'
  },
  'gender': 'male',
  'hobbies': []
});
// down side -> overwrite all fields whenever we click "Suggest an Username".

// If we wanna set value TO A SINGLE ONE FIELD?
this.signupForm.patchValue({
  'userData': {
    'username': 'Anna',
  }
});
```

Reset the form,

```jsx
onSubmit() {
	this.signupForm.reset();
										//  ^you can put object to reset specific values
}
```