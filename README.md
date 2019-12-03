# Recipe Box API

This is a boilerplate project used for starting new projects!

## `URL`
/users

## Method:
POST

### URL Params
#### Required:
 email=text, password=text, full_name=text

### Success Response
Code:201<br/>
content: {id:1,full_name:'Test User',email:'testUser@test.com',password:'P@ssw0rd'}

### Error Response
code:400<br/>
If user tries to create an account with an email already in use. <br/>Content:{error:'Email already in use' will be sent'}<br/>
If user id missing a field. <br/>Content:{error: Missin field in request body}

### Sample Call 
    postLogin(email, password) {
        let options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        }
        return fetch(`${config.API_ENDPOINT}/auth/login`, options)
            .then(res =>
                (!res.ok) ?
                res.json().then(e => Promise.reject(e)) : res.json())
    },