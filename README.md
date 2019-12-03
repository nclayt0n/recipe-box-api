# Recipe Box API

Below are a list of endpoints, their method, paramaters to include if required,success response, error response, and a sample call. 

## `URL`
/users

### Method:
POST

### URL Params
#### Required:
 email=text, password=text, full_name=text

### Success Response
Code:201<br/>
content: {id:1, full_name:'Test User', email:'testUser@test.com',password:'P@ssw0rd'}

### Error Response
code:400<br/>
If user tries to create an account with an email already in use. <br/>Content:{error:'Email already in use'}<br/>
If user id missing a field. <br/>Content:{error: 'Missing "field" in request body'}

### Sample Call 
       postUser(user) {
        let options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(user),
        }
        return fetch(`${config.API_ENDPOINT}/users`, options)
            .then(res =>
                (!res.ok) ?
                res.json().then(e => Promise.reject(e)) : res.json())
    },

## `URL`
/users/:id

### Method:
DELETE

### URL Params
#### Required:
 id=integer

### Success Response
Code:204<br/>

### Sample Call 
     deleteUser(userId) {
        let options = {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}`,
            },
            body: JSON.stringify({ 'id': userId }),
        }
        return fetch(`${config.API_ENDPOINT}/users/${userId}`, options)
            .catch(error => {
                console.error({ error })
            })
    }

## `URL`
/auth/login

### Method:
POST

### URL Params
#### Required:
 email=text, password=text, full_name=text

### Success Response
Code:200<br/>
content: {authToken}

### Error Response
code:400<br/>
 Content:{error:'Missing key in request body'}<br/>
 Content:{error: 'Incorrect email or password'}

### Sample Call 
       postUser(user) {
        let options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(user),
        }
        return fetch(`${config.API_ENDPOINT}/users`, options)
            .then(res =>
                (!res.ok) ?
                res.json().then(e => Promise.reject(e)) : res.json())
    },

## `URL`
/folders

### Method:
GET

### URL Params
#### Required:
Authorization:Bearer authToken=text

### Success Response
Code:201<br/>
content: {folders: {id: 1,
name: "test Folder 1",
user:{date_created: "2019-12-03T02:17:32.144Z",
email: "testEmailFor@RecipeBox.com",
full_name: "TestCredentials",
id: 36}
}}

### Sample Call 
```
  const options = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': authToken,
            },
        };
        Promise.all([
                fetch(${config.API_ENDPOINT}/folders,
          options)
            ])
            .then(([foldersRes]) => {
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));
                return Promise.all([foldersRes.json()]);
            })
```
          
## `URL`
/folders

### Method:
POST

### URL Params
#### Required:
 name=text,user_id=integer

### Success Response
Code:201<br/>
content: {id:1, name:'Test Folder 1', user:{date_created: "2019-12-03T02:17:32.144Z",
email: "testEmailFor@RecipeBox.com",
full_name: "TestCredentials",
id: 36}}

### Error Response
code:400<br/>
Content:{error: 'Missing key in request body'}

### Sample Call 
     const url=`${config.API_ENDPOINT}/folders`;
            const options={
                method:'POST',
                headers:{
                    'content-type':'application/json',
                    'Authorization': Bearer authToken,
                },
                body: JSON.stringify({'name','user_id'})
            };

            fetch(url,options)
    
## `URL`
/folders/:id

### Method:
PATCH

### URL Params
#### Required:
 name=text

### Success Response
Code:204<br/>

### Error Response
code:400<br/>
Content:{error: { message: 'Request body must contain name, instructions, and ingredients'}}

### Sample Call 
    const url=`${config.API_ENDPOINT}/folder/${this.props.match.params.id}`;
        const options={
            method:'PATCH',
            headers:{
          'content-type':'application/json',
          'Authorization': 'Bearer authToken,
        },
        body: JSON.stringify({name:updatedName})
    };
        fetch(url,options)

 ## `URL`
/folders/:id

### Method:
DELETE

### URL Params
#### Required:
 name=text

### Success Response
Code:204<br/>

### Sample Call 
    const url=`${config.API_ENDPOINT}/folder/${id}`;
        const options={
            method:'DELETE',
            headers:{
          'content-type':'application/json',
          'Authorization': 'Bearer authToken',
        },
        body: JSON.stringify({'id':id})
    };
        fetch(url,options)
        

## `URL`
/recipes

### Method:
GET

### URL Params
#### Required:
 Authorization:authToken=text

### Success Response
Code:200<br/>
content:{recipes:{created_by: "N.C."
date_created: "2019-12-02T23:55:51.000Z"
folder_id: 147
id: 101
ingredients: (2) [{…}, {…}]
instructions: "Preheat oven, Mix items together, Bake, Serve, and Enjoy"
link: ""
name: "Peach Cobbler"
note: ""
user: {id: 36, email: "testEmailFor@RecipeBox.com", full_name: "TestCredentials", date_created: "2019-12-03T02:17:32.144Z"}
}}

### Sample Call 
 ```   const options = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer authToken',
            },
        };
        Promise.all([
                fetch(config.API_ENDPOINT/recipes,
          options)
            ])
```

## `URL`
/recipes

### Method:
POST

### URL Params
#### Required:
 Authorization:authToken=text,'name'=text,'date_created'=timestamp,'folder_id'=integer,'instructions'=text,ingredients=text,note=text,link=text,created_by=text,user_id=integer

### Success Response
Code:201<br/>
content:{recipes:{created_by: "N.C."
date_created: "2019-12-02T23:55:51.000Z"
folder_id: 147
id: 101
ingredients: (2) [{…}, {…}]
instructions: "Preheat oven, Mix items together, Bake, Serve, and Enjoy"
link: ""
name: "Peach Cobbler"
note: ""
user: {id: 36, email: "testEmailFor@RecipeBox.com", full_name: "TestCredentials", date_created: "2019-12-03T02:17:32.144Z"}
}}
### Error Response
code:400<br/>
Content:{error: 'Missing key in request body'}

### Sample Call 
```const url=${config.API_ENDPOINT}/recipes;
        const options={
            method:'POST',
            headers:{
                'content-type':'application/json',
                'Authorization': 'Bearer authToken',
            },
            body: JSON.stringify({'name','date_created','folder_id','instructions',ingredients,note,link,created_by,user_id})
        };
        fetch(url,options)
```

## `URL`
/recipes/:id

### Method:
PATCH

### URL Params
#### Required:
  Authorization: authToken=text,'name'=text,'date_created'=timestamp,'folder_id'=integer,'instructions'=text,ingredients=text,note=text,link=text,created_by=text,user_id=integer

### Success Response
Code:204<br/>

### Error Response
code:400<br/>
Content:{error: { message: 'Request body must contain name, instructions, and ingredients'}}

### Sample Call 
```const url=config.API_ENDPOINT/recipe/updatedRecipe.id;
            const options={
                method:'PATCH',
                headers:{
              'content-type':'application/json',
              'Authorization': 'Bearer authToken',
            },
            body: JSON.stringify({
                id,
                name,
                date_created,
                date_modified,
                folder_id,
                ingredients,
                link,
                instructions,
                created_by,
                note,user_id})
        };
            fetch(url,options)
```

        
## `URL`
/recipes/:id

### Method:
DELETE

### URL Params
#### Required:
  Authorization: authToken=text,id=integer

### Success Response
Code:204<br/>

### Sample Call 
```const url=config.API_ENDPOINT/recipe/recipe.id;
        const options={
            method:'DELETE',
            headers:{
          'content-type':'application/json',
          'Authorization': 'Bearer authToken',
        },
        body: JSON.stringify({id})
    };
        fetch(url,options)
```


        