---
layout: post
title: "Angular 1 - Basics & Components & Databinding & Directives"
tags: ["MOOC", "JavaScript", "Angular"]
toc: true
icon: /img/header/angular.svg
keywords: "dynamic components mooc course fundamental installation 101 typescript ts strict mode bootstrap dropdown CLI how it works selector constructor data binding databinding property binding event binding model convention template style ng-template string interpolation core two-way 2-way two way ngModel form listener shared folder debugging sourcemap View Encapsulation Local References ViewChild DOM ng-content Component lifecycle onChanges onInit doCheck AfterView AfterContent Structure Directive ngIf ngFor ngSwitch attribute renderer custom unless ngOnChanges ngOnInit ngDoCheck ngAfterViewinit ngAfterViewChecked ngOnDestroy ngAfterContentInit ngAfterContentChecked"
---

{% assign img-url = '/img/post/angular' %}

This is my note for the course "Angular - The Complete Guide (2021 Edition)" which is taught by Maximilian Schwarzmüller on Udemy. This is an incredible course for you to start to learn Angular from basic. The official Angular docs is good but it's not for the beginner.

🍄 **PART 1** — [Angular  1 - Basics & Components & Databinding & Directives](/angular-1-basics-components-databinding-directives/)
🍄 **PART 2** — [Angular 2 - Services & Dependency Injection & Routing](/angular-2-service-dependency-injection-routing/)
🍄 **PART 3** — [Angular 3 - Observable](/angular-3-observable/)
🍄 **PART 4** —  [Angular 4 - Forms](/angular-4-forms/)
👉 [Github repo](https://github.com/dinhanhthi/learn-angular-complete-guide)
👉 **Other note** (taken before this course): [Angular 101](https://www.notion.so/Angular-101-fcbd5683f8e941f89c709595792b62d2)


::: warning
This note contains only the important things which can be look back later, it cannot replace either [the course](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/13914134#overview) nor [the official document](https://angular.io/start)!
:::

## Docs

1. [Angular - Introduction to the Angular Docs](https://angular.io/docs)
2. [Learn RxJS](https://www.learnrxjs.io/)

## Installation

```jsx
// install nodejs

// install angular CLI
sudo npm install -g @angular/cli@latest
```

### Problems of version?

```jsx
// npm version 7.5.4 detected.
// The Angular CLI currently requires npm version 6.

// SOLUTION
// using nvm
https://github.com/nvm-sh/nvm

// Check the corresponding versions between nodejs - npm
https://nodejs.org/en/download/releases/
```

::: col-2-equal
``` jsx
// install a specific version
nvm install 14
// check installed versions
nvm ls
// use
nvm use 14 // node version
```

``` jsx
// check version
npm -v
// if npm version is greater than usual? -> downgrade it
npm install -g npm@6 // eg. for node 14
// check where npm installed
which npm // should return /Users/thi/.nvm/versions/node/v14.15.5/bin/npm
```
:::

## CLI

```jsx
// new app
ng new my-new-app

// serve
ng serve
ng serve --port 4300

// create component
ng generate component <name>
ng g c <name> # shorthand
ng g c <name> --skipTests true # without test files
ng g c <name> --selector <app-name> # with selector

// create directive
ng generate directive <name>
ng g d <name>
```

## My first app

```jsx
// crate an app / project
// for a moment, choose "No" for first 2 options + CSS
ng new my-first-app
cd my-first-app
ng serve // port 4200
ng serve --port 4300 // custom
```

Input changes → name changes ⇒ [check commit](https://github.com/dinhanhthi/learn-angular-complete-guide/commit/bd06059814773ad8564204181a5e94c057620e9f) → need `[(ngModule)]` ← from `FormsModule`
⇒ two-way binding!

## Course Structure

Getting started → The basics → Components & Databinding → Directives → Services & Dependency Injection → Routing → Observables → Forms → Pipes → Http → Authentication → Optimizations & NgModules → Deployment → Animations & Testing

![Angular_1_-_Basics_&_Components_&_Databinding_&_Di_f1de7de43bbb4feebe9a09eb3a27a117/Untitled.png]({{ img-url }}/angular-1/Untitled.png)

## TypeScript

- Superset for JS → define type as you want + check when coding
- TS doesn't run in the browser → compiled to JS before that

## Integrate Bootstrap

```jsx
// cd to project
npm i --save bootstrap

// angular.json
// -> changes "styles"
"styles": [
	"node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
],

// rerun
ng serve --port 4300
// Check?
// Open page > Inspect > Sources > styles.css -> there is bootstrap there!
```

## Strict mode

Strict mode forces you to write more verbose code in some places (especially when it comes to class properties). ⇒ Disable it!!!!

```jsx
// Disable "strict mode"
// tsconfig.json
strict: false
```

## Basics

*Things I understand more from the course!*

### How Angular loaded and started?

- All things are in `/index.html` ← Single Page Application!!!
- After `ng serve`, there will be a script at the end of the page will be injected by CLI automatically!
- First code is executed → `main.ts` → `bootstrapModule(AppModule)` ← from `app.module.ts` ← there is `bootstrap: []` (this one is only in app root)

### Components

- Key feature in angular!
- After creating a new component ⇒ Don't forget to add it in module!!!! (if using `ng generate component <module-name>`, we don't need to do that manually)

    ```bash
    ng generate component <name>
    ng g c <name> # shorthand
    ng g c <name> --skipTests true # without test files
    ng g c <name> --selector <app-name> # with selector
    ```

- Split up your complex app into **reusable** components.
- Good practice: having folder name = component name
- (Convention) Name of component `ServerComponent` ← normal typescript class with decorator `@Component()`
    - Make sure unique selector `<app-server>`
- Can use **inline** in `selector, template, styles` of `@Component()` → using backtick ``` for multiple lines.

    ```tsx
    template: `
    	<app-server></app-server>
    	<p>abc</p>
    `
    ```

- For `selector`

    ```tsx
    // as a selector
    selector: "app-servers"
    // then
    <app-servers></app-servers>

    // as a class
    selector: ".app-servers"
    // then
    <div class="app-servers"></div>

    // as an attribute
    selector: "[app-server]"
    // then
    <div app-servers></div>
    ```

- `constructor`  in class → called whenever component created ← a function of TypeScript!

### Databinding

Databinding = communication

![Angular_1_-_Basics_&_Components_&_Databinding_&_Di_f1de7de43bbb4feebe9a09eb3a27a117/Untitled_1.png]({{ img-url }}/angular-1/Untitled_1.png)

```tsx
// the same
<p>Server with ID...</p>
<p>{{ 'Server' }} with ID...</p>
```

Dynamic binding DOM's properties

```tsx
<button
	class="btn"
	[disabled]="allowNewServer">Add Server</button>
// disabled is a DOM property
```

```tsx
// the same
<p>{{ allowNewServer }}</p>
<p [innerText]="allowNewServer"></p>
```

Event binding

```tsx
<button
	(click)="onCreateServer()">Add Server</button>
// we don't use usual JS onclick event!

<input
	type="text"
	class="form-control" // bootstrap's class
	(input)="onUpdateServerName($event)">
														//^ event created by (input)

// .component.ts
onUpdateServerName(event: Event){ // "Event" can by "any" but in this case we know it "Event"
	this.serverName = (<HTMLInputElement>event.target).value // can use Inspect to check these child element
									// ^Just tell typescript that our event will be HTMLInputElement
}
```

Two-way binding → enable `ngModel` directive!!!

```tsx
import { FormsModule } from '@angular/forms'
```

### Directives

Go to [this section](#directives-2).

### Model

- Model = a type of file, eg. `recipe.model.ts`
- Can be used multiple times → write a class → can be extended later!
- Những type chung chung về cái gì đó thì nên làm thành 1 model

```jsx
// recipe.model.ts
export class Recipe { // <- TYPE!!!
	public name: string;
	public description: string;
	public imagePath:

	constructor(name: string, desc: string, imagePath: string) {
		this.name = name;
		this.description = des;
		this.imagePath = imagePath;
	}
}

// use it?
// .component.ts
export class RecipeListComponent implements OnInit {
	recipes: Recipe[] = [ // using our model "Recipe" but array of Recipe(s)
				// ^ just a type
		new Recipe('Test', 'A test recipe', 'http//img/url'),
		// there can be more...
	];
}

// then use in .html
{{ .name }}, {{ .description }} ... // with *ngFor

// below are the same
<img
	src="{{ recipe.imagePath }}  // string interpolationing
	[src]="recipe.imagePath"     // property binding
>
```

```jsx
// ANOTHER WAY OF DECLARING MODEL
// Typescript Constructor Shorthand
export class Recipe { // <- TYPE!!!
	constructor(public name: string, public description: string, public imagePath: string) {}
}
```

### "shared" folder

Containing elements can be used across different features in the project!

## Debugging

- Read and understand the error messgaes.
- **Sourcemaps ⇒** Open debugger tool in browser (Chrome) > `main.bundle.js` > click some checkpoint > jump/open a new file containing the line of code (eg. `app.component.ts`) ⇒ however, if bundle gets bigger → hard to find
- Go to **webpack//** > ./ > src > all your files with the same structure on your project!!!
- Using **[Angular Augury](https://augury.rangle.io/)** (browser extension) > Add another tab in Browser Inspect tool.
    - Don't forget to click on "refresh" button on the top-right bar!

## Components & Databinding deep dive

- From  a big app → how could we split this app ([vid](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656060#overview))? → We wanna exchange info between child components with parent components.

### Binding to custom properties

```jsx
export class ... {
	element: {
		type: string,
		name: string,
		content: string
	}; // :{} -> not value, it's define a type -> make sure element may only have this type
}

// and if
element = {...} // this's assign value (like normal JS syntax)
```

By default, all properties of a components can be only used by this component only (not the outside) → That's why we need `@Input()`

```tsx
export class ... {
	@Input element: {}
}
// then
<app-server-element
	[element]="serverElement"></app-server-element>
```

```tsx
// USING ALIAS?
export class ... {
	@Input('srvElement') element: {}
}
// then
<app-server-element
	[srvElement]="serverElement"></app-server-element>
// ^has to be "srv...", "element" not working now!
```

### Binding to custom events

👉 If the communication between components (by using `EventEmitter`, input, output,..) are too complicated → check [the use of Service](https://www.notion.so/Angular-2-Services-Dependency-Injection-Routing-33ea25f32a84436ca5f306b84b615eba)! (section "Services with cross-components")

Something changes in the child, we wanna inform parent to know about them.

```tsx
// parent .html
<app-cockpit
	(serverCreated)="onServerAdded($event)"></app-cockpit>
```

```tsx
// parent .component
export class ... {
	serverElements = [...];

	onServerAdded(serverData: {serverName: string, serverContent: string}) {
		...
	}
}
```

```tsx
// child component -> need to EMIT our event
export class ... {
	@Output() serverCreated = new EventEmitter<{serverName: string, serverContent: string}>;
																				//  ^just defind the type of event

	onAddServer() {
		this.serverCreated.emit(...) // .emit is called with EventEmitter object!
	}
}
```

```jsx
new EventEmitter<void>(); // event without any information to emit!

onSelected() {
	this.recipeSelected.emit(); // without element to emit
}
```

```tsx
// USING ALIAS?
// parent .html
<app-cockpit
	(srvCreated)="onServerAdded($event)"></app-cockpit>
// child component
export class ... {
	@Output('srvCreated') serverCreated = new EventEmitter<...>;
}
// Only alias can be used outside the component!!!
// Inside the component, 'serverCreated' can be used as usual!
```

```jsx
// Receive an event and then assign directly (no need any method)?
<app-recipe-list
	(recipeWasSelected)="selectedRecipe = $event"></app-recipe-list>
// event comes from "recipeWasSelected" will be assigned to "selectedRecipe"
```

### View Encapsulation

- Encapsulation = súc tích / ngắn gọn!
- CSS classed defined in parent can be used only in parent → they are not applied to child components! ← behavior enforce by angular (not by browser)

    ```tsx
    // When inspect element, we can see some "strange" attribute
    // auto added to tag
    <p _ngcontent-eoj-0>....</p>
    // make sure this style belongs only to this component
    ```

- Every styles in css file can be applied to the component they belong to!
- Turn off "Encapsulation"? → so classes in parent can affect child component as usual css behavior, i.e. classes defined are applied globally! ← there is no "strange" attribut like `_ngcontent-eoj-0` anymore.

    ```jsx
    import { ViewEncapsulation } from '@angular/core';
    @Component({
    	encapsulation: ViewEncapsulation.None // turn off capsulation
    	_______________ViewEncapsulation.ShadowDom // read more on Mozilla
      _______________ViewEncapsulation.Emulated // default, only used inside component
    })
    ```

### Local References in template

Sometimes, we don't need 2-way binding (`[(ngModel)]`) → using local reference (eg. `#input`)

Local references can be use with any type of element (not only input) + anywhere in your template (only the template!!!).

```jsx
// with ngModel
<input [(ngModel)]="newServerName">
<button (click)="onAddServer()"></button>
// component.ts
onAddServer(){}

// with local reference
<input #serverNameInput>
<button (click)="onAddServer(serverNameInput)"></button>
// component.ts
onAddServer(nameInput: HTMLInputElement){}
```

### `@ViewChild()`

We can access local reference from component.ts by using this decorator!

```jsx
// in .html
<input #serverContentInput></input>

// in component.ts

// if wanna access selected element inside ngOnInit()
@ViewChild('serverContentInput', {static: true}) serverContentInput: ElementRef;

// if DON'T wanna ... ngOnInit()
@ViewChild('serverContentInput', {static: false}) serverContentInput: ElementRef;
// in Angular 9+, no need to add {static: false} in this case!

// Then we can use property "serverContentInput" in other place in .component.ts
```

DON'T manipulate the DOM from the component.ts!!!, like

```jsx
this.serverContentInput.nativeElement.value = 'something';
```
⇒ Use string interpolation or property binding if you wanna output something to the DOM!

### `ng-content`

- Project content into component.
- Everything between `<app-server>Text</app-server>` will be lost → angular will not take care about it! → using `ng-content`

```jsx
// child html
// put where you wanna to display "Text"
<ng-content></ng-content>

// parent html
<app-server>Text</app-server>
```

USING MULTIPLE `ng-content`?

::: col-2-equal

```jsx
// parent html
<app-child>
	<div header>Text for header</div>
	<div body>Text for body</div>
</app-child>
```

``` jsx
// child html
<ng-content select="[header]"></ng-content>
<ng-content select="[body]"></ng-content>

// => Think of using ng-container
```
:::

### Component lifecycle

- A new component created → Angular go into some phases (processes) ← we can hook into these phases

![Angular_1_-_Basics_&_Components_&_Databinding_&_Di_f1de7de43bbb4feebe9a09eb3a27a117/Untitled_2.png]({{ img-url }}/angular-1/Untitled_2.png)

- `ngOnChanges` → called after bound input property changes (remember `@Input()`) ← listen to the changes
- `ngOnInit` → called once component is initialized (after `constructor`)
- `ngDoCheck` → called during every change detection run → useful when you wanna do something on evert change detection cycle
- "Content" in above life cycle hooks ← comes from `<ng-content></ng-content>`
- Rarely need to use all of them!
- `ngAfterViewinit` → before that, there is no some view, we cannot do anything with it. Using this hook to make sure that some component is presented in DOM (View)!
- We have different "ContentInit" and "ViewInit" here because "Content" and "View" are different. Check more on section "[ViewChild](#%40viewchild())" and "[@ContentChild](#%40contentchild())" to see the different!

Order on starting

```jsx
constructor > ngOnChanges > ngOnInit > ngDoCheck
> ngAfterContentInit > ngAfterContentChecked
> ngAfterViewInit > ngAfterViewChecked
// whenever input changes -> ngOnchanges
// whenever there are changes -> ngDoCheck
```

```jsx
// How to use?
export class ... implements OnInit, OnChanges, OnDestroy {
	ngOnInit() {}
	ngOnChanges() {}
	ngOnDestroy() {}
}
```

```jsx
// testing ngOnChanges
import { OnChanges, SimpleChanges } from '@angular/core';
export class ... implements OnChanges {
	@Input() element: ....

	OnChanges(changes: SimpleChanges) {
		console.log('ngOnChanges called!');
		console.log(changes);
	}
}

// then open Inspect
// in object element: SimpleChange
// there are "currentValue", "firstChange", "previousValue",...
```

```jsx
// DoCheck
// -> wanna do something on evert change detection cycle
import { DoCheck } from '@angular/core';
export class ... implements DoCheck {
	ngDoCheck() {

	}
}
```

Whenever there are changes!!!! (event when clicked / Promise back from loaded data,....) > `ngDoCheck`

```jsx
// onDestroy()
// Called when component is destroyed -> when removed from the DOM
// Wanna make a test?

// in child component.ts
ngOnDestroy() {
	console.log("ngOnDestroy called!");
}

// in parent html
<button (click)="onDestroyFirst()>Destroy component</button>

// in parent component.ts
onDestroyFirst() {
	this.serverElements.splice(0, 1);
}
```

### `@ContentChild()`

`@ViewChild()` is used to access to "local reference" in the same component.

If you wanna access "local reference" in a content → use `@ContentChild()` (It's not part of the view, it's a part of the content)

::: col-2-equal
```jsx
// parent html
<app-server-element
	<p #contentParagraph>Text</p>
></app-server-element>
```

``` jsx
// child html
<ng-content></ng-content>
```
:::

``` jsx
// child component.ts
export class ...{
	@ContentChild('contentParagraph') paragraph: ElementRef;
}

// In case you wanna call "contentParagraph" in parent component.ts
// => use @ViewChild() in parent component.ts as usual!
```

## Directives

- Directives = instructions in the DOM
- You could/should create a separated folder containing all your custom directives.

### Attribute vs Structural

![Angular_1_-_Basics_&_Components_&_Databinding_&_Di_f1de7de43bbb4feebe9a09eb3a27a117/Untitled_3.png]({{ img-url }}/angular-1/Untitled_3.png)

### Structural directives

``` html
<!-- else -->
<p *ngIf="serverCreated; else noServer">Text</p>
<ng-template #noServer>
	<p>Other text</p>
<ng-template>
```

```tsx
// toggle show button
<button (click)="showSecret = !showSecret">Show password</button>
<p *ngIf="showSecret">Password</p>
```

We cannot have more than 2 structurual directives on the same element!

```jsx
// WRONG
<li *ngFor="..." *ngIf="..."></li>
```

::: col-2-equal
```tsx
// *ngFor
<div *ngFor="let logItem of log">{{ logItem }}</div>
// log has type array, is in .component.ts
```

``` jsx
//index of for
<div *ngFor="let i = index">{{ i }}</div>
```
:::

Behind the scene of `*`? ← let angular know it's a structural directive → it will transform them into something else (different from *property binding, event binding, 2-way binding, string interpolation*) ← without *, it cannot separate!

```jsx
// instead of using * like
<div *ngIf="!onlyOdd"></div>

// we can use (angular will translate *ngIf to something like that)
<ng-template [ngIf]="!onlyOdd">
	<div></div>
</ng-template>
```

### Attribute directives

Unlike structural directive, **attribute directives** don't add or remove elements. They only change the element they were placed on!

```tsx
<p [ngStyle]="{backgroundColor: getColor()}">Text</p>
 // ^	  		// ^we can use background-color
 // | "[]" is not a part of directive -> it just tell us that we wanna bind
 //        some property on this directive!

<p [ngClass="{online: serverStatus == 'online'}">Text</p>
//            ^.online class
```

Unlike structural directives, we can use ngStyle and ngClass in the same element (with another structural directive)

### Custom attribute directive

:point_right: Using [Renderer2](https://angular.io/api/core/Renderer2)

In this section, we learn a way to access/modify DOM element inside a directive (or component, class,...)

```tsx
// CUSTOM DIRECTIVE
<p appHighlight>Text</p>

// .component.ts
// or something.directive.ts (and then import it in .component.ts)
import { Directive, OnInit, ELementRef, Renderer2, HostListener } from '@angular/core';
												//  ^important: use this to not touch directly on the DOM
												//   elements ('cause it's bad practice!)
@Directive({
	selector: '[appHighlight]'
})
export class HighlightDirective implement OnInit {
	constructor(private elRef: ELementRef, private renderer: Renderer2) { }

	ngOnInit() {
		this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue');
	}

	// or listen to some event
	@HostListener('mouseenter') mouseover(eventData: Event) {
							// ^JS event    ^custom name
		...
	}
}
```

``` jsx
// then add it in .module.ts
@NgModule({
	declarations: [appHighlight]
})
export class .... {}
```

Don't wanna use Renderer2?

```jsx
@Directive({
	selector: '[appHighlight]'
})
export class ... {
	@HostBinding('style.backgroundColor') bgColor: string = 'transparent';
						//	^like normal JS					^custom var		  ^ gives it initial value

	// then access it likes
	ngOnInit() {
		this.bgColor = 'blue';
	}

}
```

For example, we can let the users choose the color they want instead of `'blue'` like above!

```jsx
// if we wanna use input for custom directive?
<p appHighlight [defaultColor]="'yellow'">Text</p>
// |            ^ we could use defaultColor="yellow" but be careful, we must
// |              be sure that there is no conflict with already-have attributes!
// ^ we could use [appHighlight]="'red'" if there is any alias in the directive

// in .directive.ts
@Directive({...})
export ... {
	@Input() defaultColor: string = 'transparent';
	@Input('appHighlight') highlightColor: string = 'blue';

	// some commands using above 2 inputs.
}
```

How angular knows `defaultColor` is an input of directive `appHighlight` or property of `<p>`? →   it checks your custom directives first, then check the native properties after that.

### Custom structure directive

```jsx
// unless directive
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[appUnless]'
})
export class UnlessDirective {
	@Input() set appUnless(condition: boolean) {
				// |   ^make sure the same as the selector!
				// ^a setter of a property which is a method which get executed whenever
				//  the property changes
		if (!condition) {
			this.vcRef.createEmbeddedView(this.templateRef);
		} else {
			this.vcRef.clear(); // remove everything from this place in the DOM
		}
	}

	constructor(private templateRef: TemplateRef<any>, private vcRef: ViewContainerRef {
						   //     ^ what to be applied?                  ^ where to be applied?
														//     ^ look like ElementRef but for ng-template
	}
}

// don't forget to add it to declaration in module.ts
```

Use `*appUnless`,

::: col-2-equal
```jsx
// if using *ngIf
<div *ngIf="!onlyOdd"></div>
```

``` jsx
// if using *appUnless
<div *appUnless="onlyOdd"></div>
```
:::

### `*ngSwitch`

::: col-2-equal
```jsx
<div [ngSwitch]="value">
	<div *ngSwitchCase="5"></div>
	<div *ngSwitchCase="10"></div>
	<div *ngSwitchDefault></div>
</div>
```

``` jsx
// in component.ts
export class ... {
	value = 10;
}
```
:::

### Project: Dropdown

👉 Check [this](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/8-prj-directives-final).

```jsx
@Directive({
	selector: '[appDropdown]'
})
export class DropdownDirective {
	@HostBinding('class.open') isOpen = false;
	@HostListener('click') toggleOpen() {
		this.isOpen = !this.isOpen;
	}
}
```

```jsx
// closing dropdown from anywhere
@Directive({
	selector: '[appDropdown]'
})
export class DropdownDirective {
	@HostBinding('class.open') isOpen = false;
	@HostListener('document:click', ['$event']) toggleOpen(event: Event) {
		this.isOpen = this.elRef.nativeElement.contains(event.target)
				? !this.isOpen : false;
	}
	constructor(private elRef: ElementRef) {}
}
```

## Dynamic Components

This part is vert later than above parts. However, it talks about components, I put it here. For example, we wanna show error, modal, ....

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/16-dyn-cmp-finished/src/app).

(Video) → [what are "dynamic components"?](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/14466464#questions) → it means that they are not always there but they will be there if there are something happens with your codes.