export class GitHubUser {
    static search(userName) {
        const endPoint = `https://api.github.com/users/${userName}`
        
        return fetch(endPoint).then(data => data.json()).
        then(data => ({
            login: data.login,
            nome:data.name,
            public_repos: data.public_repos,
            followers: data.followers,

            

        }))


}
}




export class favorites {
    constructor(root){
        this.root = document.querySelector(root)
        this.load() 
        
       
    }
    load(){
        this.users = JSON.parse(localStorage.getItem(`@github-favorites:`)) || []
       
    
    }
    save(){
        localStorage.setItem("@github-favorites:", JSON.stringify(this.users))
    }
    async add(userName) {
        try{
        const userExists = this.users.find(entry => entry.login === userName)
        if(userExists) {
            throw new Error ("usuário já cadastrado")
        }
        
        
            const user = await GitHubUser.search(userName)
        
        if (user.login === undefined){
            throw new Error ("usuário não encontrado")
        } 
        
        this.users = [user, ...this.users]
        this.update()
        this.save()
        
        }


        catch (error) { 
            alert(error.message)
        }
        

        
          
    }
    delete(user) {
        const filteredUsers = this.users.filter( entry => entry.login !== user.login)
        this.users = filteredUsers
        this.update()
       
    }

}
export class favoritesView extends favorites {
    constructor(root){
        super(root)

    this.tbody = this.root.querySelector("table tbody")
    
    this.update()
    this.onadd()
}
    onadd(){
    const addButton = this.root.querySelector(".search button")
    addButton.onclick = () => {
        const {value} = this.root.querySelector("#input-search")

        this.add(value)


    }
}

    
    update() {
        this.removeAllTr()

        this.tbody = this.root.querySelector('table tbody')

        this.users.forEach(user => {
            const row = this.createRow()
            
            row.querySelector(".user img").src =`https://github.com/${user.login}.png`
            row.querySelector(".user img").alt = `imagem de ${user.nome}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector(".user p").textContent = user.nome
            row.querySelector(".user span").textContent = user.login
            row.querySelector(".repositories").textContent = user.public_repos
            row.querySelector(".followers").textContent = `${user.followers}`
            row.querySelector(".remove").onclick  = () => {
            const isok = confirm("Tem certeza que deseja deletar essa linha?")
                if(isok) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)

            

        })



        

        
        
    }

    createRow() {
        const tr = document.createElement("tr")
        const content = `<td class="user">
        <img src="https://github.com/pedrocosta-7.png" alt="imagem de Pedro Costa">
        <a href="https://github.com/pedrocosta-7"  target="_blank">
        <p>Pedro Costa</p>
        <span>pedrocosta-7</span>
        </a>
        </td>
        <td class="repositories">
        76
        </td>
        <td class="followers">
        90000
        </td>
        <td>
        <button class="remove">&times;</button>
        </td>`
         
        tr.innerHTML = content

        return tr

    }
    
    removeAllTr() {
        this.tbody.querySelectorAll("tr").forEach((tr) => {tr.remove()})
    
        
    
    }
}


