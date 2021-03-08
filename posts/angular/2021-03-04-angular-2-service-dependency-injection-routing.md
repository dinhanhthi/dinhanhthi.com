---
layout: post
title: "Angular 2 - Services & DI & Routing"
tags: ["MOOC", "JavaScript", "Angular"]
toc: true
icon: /img/header/angular.svg
keywords: "mooc course fundamental installation 101 typescript ts service logging user inject cross components pushing data routerlink paths active navigate navigation parameters query url redirect wildcat routes login guards authentication privacy security dynamic data static data udemy maximilian injectable"
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

Get a copy, not access directly,

```jsx
// for example
export class ... {
	private recipes: Recipe[] = [];

	getRecipes() {
		// get a copy from outside, not access the original recipes
		return this.recipes.slice();
	}
}
```

👉 [Spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). (`...var`)

```jsx
// ES6's feature (spread operator): tranform "[a, b, c]" to "a, b, c"
// because we cannot .push([]), but we can .push(a,b,c)
this.ingredients.push(...ingredients);
```

```html
<!-- if we just bind a string -->
<div abcXyz="abc">
<div [abcXyz]="'abc'">
<div [abcXyz]="['abc']">

<!-- if we bind objects -->
<div abcXyz="{}">
```

```jsx
// convert from string to number
const id = +this.abc['id']; // just add "+" before it!
```

```jsx
// an optional param in a method
abc(required_1, required_2, optional?) { // with "?"
	...
}
```

```jsx
// When creating a new service (example.service.ts), you wanna add it in
// app.module.ts in the section "providers"

// You can make a shortcut right in the file example.service.ts
// and no need to give it name in app.module.ts
@Injectable({providedIn: 'root'})
export class .... { }
```

```jsx
// inject a service in a component
export class ... {
	constructor(private serviceName: ServiceName) { }
	// then you can use it here!
}
```

## Services & Dependency Injection

### Service?

- Don't duplicate tasks.
- Access data and used in somewhere.
- Just another class which help centralize your codes.

![Angular_2_-_Services_&_Dependency_Injection_&_Rout_fb1390f6e4ee48849ae39feb665bdf1b/Untitled.png]({{ img-url }}/angular-2/Untitled.png)

Why we need services? If we don't use, just use what we have (binding, emit,...) → more components and they need to communicate to each other → too complicated!

### DI & Logging service

- [Course video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656208#questions/7884774).
- Naming: `logging.service.ts`
- There is NO DECORATOR like @Service() → just a normal typescript class!

DI injects class (of a service) into our component automatically. ← we need to inform angular that we need to add this instant → add a constructor

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/09-services-final/src/app).

```jsx
// new-account.component.ts
import { LoggingService } from '../logging.service';

@Component({
	providers: [LoggingService] // 2) angular know how to gives us this instan
})
export class ... {

	// 1) tell angular: we need an instance of LoggingService class
	constructor(private loggingService: LoggingService) {}
									//  ^ custom name

	// use it
	onCreateAccount() {
		...
		this.loggingService.logStatusChange(...); // angular created this for us auto
//  ^ reuse this line multiple times in multiple components
	}
}
```

### Data Service

Service: store and manage our data → exchange property & event binding → get event to app component.

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/09-services-final/src/app).

```jsx
// reference pointing
this.accounts = this.accountsService.accounts;
// they are actually the same object (ie. this.accountsService.accounts)
```

Without account services, we have to emit & output our data and event (add acc for example). However, with services, we don't need them anymore, just inject the service and put the account into it!

### Hierarchical injector

Inject a service to father → all its child component get the same instance of the service! ⇒ only go down in the tree components → if there is a duplicate in child, it will overwrite the father's.

![Angular_2_-_Services_&_Dependency_Injection_&_Rout_fb1390f6e4ee48849ae39feb665bdf1b/Untitled_1.png]({{ img-url }}/angular-2/Untitled_1.png)

[[video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656222#overview)] If don't want create A NEW INSTANCE IN CHILD (which will overwrite the one coming from father) → just remove the service in `providers`! → it will use the service of the father.

### Inject Services into Services

- Normally, if service A doesn't contain (inject) any service → no need `@Injectable()`
- If we wanna inject service B into service A → we need to add `@Injectable()` into A (not B!!!!)

    ```jsx
    // service B

    // service A
    @Injectable()
    export class ServiceA {
    	constructor(private serviceB: ServiceB) {}
    	// something using serviceB
    }
    ```

**GOOD PRACTICE**: ALWAYS ADD `@Injectable()` for all services!

### Services with cross-components

With services, we don't have to build complex inputs, outputs chanes where you pass events and properties to get data from component A to B,... → much cleaner!

 👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/09-services-final/src/app).

```jsx
// accounts.service.ts
@Injectable()
export class AccountsService {
	statusUpdated = new EventEmitter<string>();
}

// account.component.ts
@Component({})
export class AccountComponent {
  @Input() account: {name: string, status: string};
  constructor(private accountsService: AccountsService) {}
					 // ^ a shorthand to create a property with the same name as
					 //   "accountService" <- we can "this.accountService".
  onSetTo(status: string) {
    ...
    this.accountsService.statusUpdated.emit(status); // emit an event
  }
}

// new-account.component.ts
@Component({})
export class NewAccountComponent {
	constructor(private accountsService: AccountsService) {
    this.accountsService.statusUpdated.subscribe( // event is observable!
      (status: string) => alert('New Status: ' + status) // capture that event!
    );
  }
}
```

👉 Example: [exchange active / inactive users](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/10-services-assignment-solution/src/app).
👉 [Project with recipes and shopping-list](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/11-prj-services-final/src/app/recipes). (change from using EventEmitter to service) — [videos](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656236#overview)

### Service - pushing data from A-B

When we use `.slice()` to copy a list (to work on this), there may be some event cannot access the original one (eg. when using `addIngredients`) → we need to emit an event containing the original list.

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/11-prj-services-final/src/app/shopping-list)

```jsx
// shopping-list.service.ts
export class ... {
	ingredientsChanged = new EventEmitter<Ingredient[]>();
	private ingredients: Ingredient[] = [...];
	...
	addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.emit(this.ingredients.slice());
  }
}
```

``` jsx
// shopping-list.component.ts
export class ... implements OnInit {
	ingredients: Ingredient[];
	constructor(private slService: ShoppingListService) { }
	ngOnInit() {
	  ...
	  this.slService.ingredientsChanged
	    .subscribe(
	      (ingredients: Ingredient[]) => {
	        this.ingredients = ingredients;
	      }
	    );
	}
}
```

## Routing → change pages

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/12-routing-final/src/app)
👉 [Example of final project using routing](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/13-prj-routing-final/src/app).

### Adding Routes

Angular ships its own *router* which allows to change URLs of our application.

Where? ⇒ Because the router controls URLs of all things in our apps, the place we can put it is in `app.module.ts`

```jsx
// app-routing.module.ts
//----------------------
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'users', component: UsersComponent }, // something: http//localhost:4200/users
				//^ without "/"
	{ path: 'servers', component: ServersComponent }
]

@NgModule({
	import: [
		RouterModule.forRoot(appRoutes)
							// ^ register our routes to the RouterModule of our app
	]
})
```

```jsx
// where to display component after click?
// app.component.html
//----------------------
<router-outlet></router-outlet> // <- a directive shipped by angular!!!
```

### `routerLink`

Add some links to app ([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656284#overview))

``` html
<!-- if we add links to a normal <a> => it will reload the app! -->
<!-- => USE A SPECIAL DIRECTIVE "rounterLink" -->
<!-- app.component.html -->
<a routerLink="/">
<a routerLink="/servers">
<a [routerLink]="['/users']">
			<!-- ^ we can use "'/users'" <- has to have '' because without it, -->
			<!-- |   angular will look for a property "/users" instead of a string -->
			<!-- ^ we use [] to add more complicated path here -->
			<!--   for example, ['/users', 'something'] <- /users/something -->

<!-- routerLink capture the click event + prevent the default behavior (which reloads -->
<!-- entire our app) -->
```

### Understand paths

([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656286#overview)) Why we need `"/"` before `"/servers"`? → if we on home page, it't normal, but if we in subpage (eg. /servers), if there is another link to "servers" (eg. `<a routerLink='servers'>`), it will be "`/servers/servers`" ← error!!!

We can *relative / absolute paths* inside `routerLink`.

```jsx
routerLink="/abc" // abs path: localhost:4200/abc
routerLink="abc" // if you are in localhost:4200/xyz -> localhost:4200/xyz/abc
routerLink="./abc" // relative path: current position + /abc
routerLink="../abc" // relative path: father path + /abc
```

### `routerLinkActive`

We use `<a class="active">` for current tab. ← how to use angular to add/remove this class auto?

```jsx
// don't forget to add "routerLinkActive" to ALL "li"
<li routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
									//  ^css class                      //  ^only active if it's exactly the FULL path
	<a routerLink="/servers">Servers</a>
</li>

// we add "routerLinkAcitve" inside <a> if we want
```

([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656288#overview)) `routerLinkActive` will check if the current path contains the path given in `routerLink` ← the empty path, ie. `"/"` is in all paths!!! → this may lead to a problem in which "Home" tab is always "active" ⇒ we need `routerLinkActiveOptions`

### Navigating programmatically

Perform navigation after users click on some button, for example.

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/12-routing-final/src/app)

```jsx
// home.component.html
<button (click)="onLoadServers()">Load servers</button>

// home.component.ts
export class ... {
	constructor(private router: Router) { }
	onLoadServers() {
		// complex calculations
		this.router.navigate(['/servers']);
	}
}
```

If we want `.navigate()` knows where we are,

```jsx
// servers.component.html
<button (click)="onReload()">Reload page</button>

// servers.component.html
export class ... {
	constructor(private router: Router,
							private route: ActivatedRoute) {
													// ^simply inject current route which load the component
													// a route => simply a javascript object
}

	onReload() {
		this.router.navigate(['/servers']);
						// ^with this method, we don't get the problem of
						// /servers/servers like in routerLink if we use ['servers']
						// REASON: .navigate() doesn't know where we currently are, it just
						//   know the path of template -> '/servers' is the same as 'servers'

		// If we wanna use relative path with .navigate()?
		this.router.navigate(['/servers'], {relativeTo: this.route});
											//  ^             ^with this, angular knows what is currenty
											//  |                active route
											//  | we can use ['../'] (like a relative path)
	}
}
```

### Add params to Route

(Videos: [Passing params to Routes](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656296#overview) + [Fetching Route params](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656298#overview) + [fetch reactively](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656302#overview)) For example we wanna navigate to users, each user a path → change with ids. ← `id` will be the param of the Route.

👉 [Codes for this section](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/12-routing-final/src/app).

```jsx
// app-routing.module.ts
const appRoutes: Routes = [
	{ path: 'users/:id/:name', component: UserComponent }
					//     ^without this, localhost/users/something will get error!
]
```

Get the `id` from the router,

```jsx
// user.component.ts
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

export class ... {
	user: {id: number, name: string};
	paramsSubscription: Subscription;

	constructor(private route: ActivatedRoute) { }
					//  ^ gives us access to the id passed in the URL -> selected user

	ngOninit() {
		// OPTION 1: INITIAL ONLY
		this.user = {
			id: +this.route.snapshot.params['id'], // <- from 'users/:id'
								//   ^it's just a snapshot of the 1st initialization
			name: this.route.snapshot.params['name'] // <- from 'users/:id/:name'
									//     if we change url dynamically, it won't work!
		};

		// OPTION 2: subscribe to the change of url (whenever we click)
		this.paramsSubscription
			= this.route.params
							 // ^it's an observable -> help you work with async tasks
																											 //   ^in the future, users perform some tasks
																											 //   -> you don't know where, when, how long,...
	      .subscribe(
	        (params: Params) => {
	          this.user.id = +params['id']; // "+" to convert to number
	          this.user.name = params['name'];
	        }
	      );
	}

	ngOnDestroy() {
    this.paramsSubscription.unsubscribe(); // end of subscription!
		// in fact, for this router, you don't have to do this because
		//   angular will destroy the subscription for you
		//   but in general case for OBSERVABLE THAT YOU CREATED,
		//   you should .unsubcribe() it!
  }
}
```

```jsx
// user.component.html
<p>User with ID {{ user.id }}</p>
<p>User with name {{ user.name  }}</p>
```

**GOOD PRACTICE:** Always `.unsubscribe()` the observable has been created!

### Query params (?...)

:point_right: [Video for this section](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656308#overview).

```jsx
// inside an a tag in html
<a
  [routerLink]="['/servers', server.id]" // locahost/servers/3
  [queryParams]="{allowEdit: server.id === 3 ? '1' : '0'}" // .../3?allowEdit=1
  fragment="loading" // ...?allowEdit=1#loading
  >
  {{ server.name }}
</a>
```

```jsx
// navigate from a button?
// servers.component.html
<button (click)="onReload()">Reload page</button>
```

```jsx
// servers.component.html
export class ... {
	constructor(private router: Router) { }

	onReload(id: number) {
		// localhost/servers/1/edit?allowEdit=1#loading
		this.router.navigate(['/servers', id, 'edit'],
			{
				queryParams: {allowEdit: '1'},
				fragment: 'loading'
			}
		);
	}
}
```

How to retrieve the informatoin from the URLs? ⇒ check [video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656314#overview).

```jsx
// edit-server.component.ts
constructor(private route: ActivatedRoute) { }
								 // ^simply inject current route which load the component

// 1st approach -> only get the ones created on init
ngOnInit() {
	console.log(this.route.snapshot.queryParams);
	console.log(this.route.snapshot.fragment);
}

// 2nd approach -> allow you to react to the change of query params
ngOnInit() {
	this.route.queryParams.subscribe();
	this.route.fragement.subscribe();
}
```

### Nested / Child router

([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656322#overview) + [codes](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/12-routing-final/src/app)) No need to change to a new page for each child component, just display them on a sidebar (a part of the view) when we click on the navigator.

```jsx
// app-routing.module.ts
const appRoutes: Routes = [
	{ path: 'servers', component: ServersComponent, children: [
		{path: ':id', component: ServerComponent},
		{path: ':id/edit', component: EditServerComponent }
	] }
]
```

```jsx
// servers.component.html
<router-outlet></router-outlet> // replace "old" <app-server> and <app-edit-server>
//^ all the child routes inside this component will be shipped by angular
//  -> that's why we have several "the same" <router-outlet> in our app
```

### Preserve query params between paths

Before enter to edit-server, there is `?allowEdit=1`, however, after navigate to edit-server, this info is gone. How to preserve it?

```jsx
// server.component.ts
onEdit() {
	this.router.navigate(
		['edit'],
		{
			relativeTo: this.route,
			queryParamsHandling: 'preserve'
											//   ^keep the old + overwrite to the new one
											//   ^'merge' if you wanna merge old + new
		}
	);
}
```

### Redirect & wildcat routes

For example: building 404 page.

```jsx
const appRoutes: Routes = [
	{ path: 'not-found', component: PageNoteFoundComponent },
	// a specific path
	{ path: 'something', redirectTo: '/not-found'  }, // redirect /something to /not-found
	// all the paths (performed after THE ABOVE <- order makes sense!!!!)
	{ path: '**', redirectTo: '/not-found' }
]
```

Error of `path: ''` (nothing) ← default behavior to check in angular is "prefix" (check from beginning) → every urls contains this "nothing" (`''`)

```jsx
// errors
{ path: '', redirectTo: '/somewhere-else' }

// fix
{ path: '', redirectTo: '/somewhere-else', pathMatch: 'full' }
```

### `app-routing.module.ts`

Store all routing tasks in a single file. → no need to stored in `app.module.ts`.

👉 [Example file](https://github1s.com/dinhanhthi/learn-angular-complete-guide/blob/master/12-routing-final/src/app/app-routing.module.ts).

```jsx
// app-routing.module.ts
// no need to re-declare components like already done in app.module.ts
const appRoutes: Routes = [...];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
```

```jsx
// app.module.ts
...
@NgModule({
	...
	imports: [
		AppRoutingModule
	]
	...
})
```

### Login & Guards & Authentication

([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656342#overview)) Create `auth-guard.service.ts` ([file](https://github1s.com/dinhanhthi/learn-angular-complete-guide/blob/master/12-routing-final/src/app/auth-guard.service.ts)) containing the service to control the authentication. → use `CanActivate` ← ==angular executes this before router loaded!==

```jsx
// auth-guard.service.ts
export class AuthGuard ....{
	canActivate(
	  state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

	// Obersvable / Promise -> some tasks need auth from server/databse <- async
	// boolean -> some tasks completely on client <- sync
}
```

Example: `auth.service.ts` → a fake service for the testing. In real app, we use this file to get the info / confirmation from the server about the authentication!

Apply to routes?

```jsx
// app-routing.module.ts
{path: '...', canActivate: [AuthGuard], component: ..., children: ...} // apply also for children
//            ^add this to the path you wanna apply auth
```

 ([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656356#overview)) Show the father route list, only protect child routes? → use `CanActivateChild`

```jsx
// auth-guard.service.ts
export class AuthGuard ....{
	canActivate(
	  state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

	canActivateChild(...){...}
}

// app-routing.module.ts
{path: '...', canActivateChild: [AuthGuard], component: ..., children: ...}
```

([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656346#overview) + [file](https://github1s.com/dinhanhthi/learn-angular-complete-guide/blob/master/12-routing-final/src/app/servers/edit-server/can-deactivate-guard.service.ts)) Control whether you are allowed to leave a route or not ← ==Confirm to leave the input/changes==!!! solve the problem of user accidentially navigating away!!!

**Idea**: angular router can execute `canDeactivate()` in a service (`can-deactivate-guard.service.ts`) > component we are currently on has `canDeactivate()` ← how guard communicates with our components.

```jsx
// can-deactivate-guard.service.ts
export interface CanComponentDeactivate {
	canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export class CanDeactivateGuard implements canDeactivate<CanComponentDeactivate> {
	canDeactivate(component: CanComponentDeactivate, ...): ... {
		return component.canDeactivate();
	}
}
```

```jsx
// app-routing.module.ts
{path: ..., ..., canDeactivate: [CanDeactivateGuard]}

// app.module.ts
providers: [CanDeactivate]
```

```jsx
// edit-server.component.ts
export class ... implements CanComponentDeactivate {
	canDeactivate():... {
		// check if there are some changes and return true/false
	}
}
```

### Parsing static data to route

([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656358#overview) + [code](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/12-routing-final/src/app)) Navigate to an error page with custom message from route.

```jsx
// error-page.component.html
<h4>{{ errorMessage }}</h4>
```

```jsx
// error-page.component.ts

export class ErrorPageComponent implements OnInit {
	errorMessage: string;

	constructor(private route: ActivatedRoute) { }
									//  ^simply inject current route which load the component

	ngOnInit() {
		this.errorMessage = this.route.snapshot.data['message'];
																				//  ^ there is "data" in app-routing.module.ts
		// or subscribe to the changes
		// (including the init snapshot)
		this.route.data.subscribe(
      (data: Data) => {
        this.errorMessage = data['message'];
      }
    );
	}
}
```

```jsx
// app-routing.module.ts
{ path: 'not-found', component: ErrorPageComponent, data: {message: 'Page not found!'} }
```

### Parsing dynamic data (server) to route

([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656360#overview) + [codes](https://github1s.com/dinhanhthi/learn-angular-complete-guide/tree/master/12-routing-final/src/app/servers)) Display the component after fetch from the server (async data) → should watch the videos + below notes:

```jsx
// server-resolver.service.ts
resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Server> | Promise<Server> | Server {
  return this.serversService.getServer(+route.params['id']);
													// ^this service here will rerendered whenever we
													// rerender the route
}
// unlike the component itself, this is executed each time, so no need to set
// up an observable or something like that
```

```jsx
// app-routing.module.ts
{ path:..., component:..., resolver: {server: ServerResolver} }
																	//  ^choose a name you like
// but make sure "server" is set the same in
// server.component.ts_____________________
ngOnInit() {                         //    |
	this.route.data                  //      |
		.subscribe(                  //        |
			(data: Data) => { this.server = data['server'] }
		);
}
```

### Location strategies

([video](https://www.udemy.com/course/the-complete-guide-to-angular-2/learn/lecture/6656364#overview)) When deployment, all URLs are parsed by the server (which hosts your app) first → then angular → route of angular (eg. nagivate something strange page to not found) may not work like on localhost. → need to make sure your web server return html file you want!

Hash mode routing → informs your web server on care the part of URL before "#"! → all things behind will be ignored by webserver.

```jsx
localhost:/users -> localhost:/#/users
													//   ^from this to end: ignored by webserver
```

```jsx
// app-routing.module.ts
@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes, {useHash: true})
	]
})
export ...
```