const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 800;

c.fillRect(0,0,canvas.width,canvas.height)


class Sprite{
    constructor(position,velocity){
        this.position = position;
        this.velocity = velocity;
    }
    draw(){
        c.fillStyle='limegreen'
        c.fillRect(this.position.x,this.position.y, 60, 20)

    }
    checkBounds(){
        if(this.position.x + 80 >= canvas.width){
            this.position.x = canvas.width -80;
        }
        else if (this.position.x  <= 0){
            this.position.x = 0;
        }
    }
    getPos(){
        return (this.position)
    }
    update(){
        this.draw();
        this.position.x += this.velocity;
        
        this.checkBounds()
    }
    
}

class Bullet{
    constructor({position}){
       this.location = position;

    }
    draw(){
        c.fillStyle='limegreen'
        
        c.fillRect(this.location.x,this.location.y, 5, 15)

    }
  
    update(){

            this.draw()
            
            this.location.y -= 1

        
    }
}

class EnemyBullet{
    constructor({position}){
        this.enemybulletLocation = position

    }
    
    drawEnemyBullet(){
        c.fillStyle='red'
        
        c.fillRect(this.enemybulletLocation.x,this.enemybulletLocation.y, 5, 10)
        
        
    }
    
    update(){

            
            this.drawEnemyBullet()
            this.enemybulletLocation.y += 0.6
            this.enemybulletLocation.x = this.enemybulletLocation.x
        
    }
}

class Enemies{
    constructor({position}){
        this.position = position

        this.image = new Image()
        this.image.src = 'invaders.png';
        this.spriteWidth = 88.5;
        this.spriteHeight = 97;
        this.frameX =0;
        this.staggerFrame = 150;
        this.gameFrame = 0;

        this.deathImage = new Image()
        this.deathImage.src = 'death.png'
        this.deathImageWidth = 83
        this.deathImageHeight = 83

        this.isDead = false

        this.bulletSpeed = 3;
        
    }
    animateFrames(){

        c.fillStyle = 'red'
        
        
        

        if(this.gameFrame % this.staggerFrame == 0){

            if(this.frameX < 1){
                this.frameX++
            }
            else{this.frameX = 0}
        }
        this.gameFrame++

    }
    draw(){
        
        if (this.isDead == true){
            c.drawImage(this.deathImage, this.position.x, this.position.y, 40,40 )
            
        }
        else{
            c.drawImage(this.image,this.frameX * this.spriteWidth, 0 ,this.spriteWidth, this.spriteHeight,this.position.x, this.position.y,40,40)
        }

       
    }
    death(position){

        this.position = position;
        
        // switch(this.isDead){

        //     case true: 
        //         c.drawImage(this.deathImage, this.position.x, this.position.y, 40,40 )
        //     break
        //     case false: 
        //     c.drawImage(this.image,this.frameX * this.spriteWidth, 0 ,this.spriteWidth, this.spriteHeight,this.position.x, this.position.y,40,40)
        //     break
        // }
        
        
            
    }
    fire(enemyBullets){
        
        


        enemyBullets.push( new EnemyBullet({position: {x: this.position.x + 40/2,
            y: this.position.y}}))
    }
    update({velocity}){
        this.draw()
    
        this.position.x += velocity.x
        this.position.y += velocity.y
        this.animateFrames()
        
        
    }
}

class Grid{
    constructor(){
        this.position={
            x: 0, y:0
        }
        this.velocity={
            x:0.1, y:0
        }
        this.invaders =[]
        
        
        this.columns = 10
        this.rows = 5

        this.width = (this.columns * 54)
        
         for (let x=0;x<this.columns;x++){
            for(let y= 0;y< this.rows; y ++){
                this.invaders.push( new Enemies({
                    position: {
                        x: x * 55 ,
                        y: y * 55 ,
                    }
                }))
            }
            
             
         }
        console.log(this.invaders)
    }
    move(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }

    update(){
        this.move();
        
        


        this.velocity.y = 0
        if(this.position.x + this.width >= canvas.width || this.position.x  <= 0){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
            
            
        }
        
    }
}

const keys = {
    a:{
        pressed : false
    },
    d:{
        pressed: false
    },
    Space:{
        pressed: false
    },
    w:{
        pressed:false
    }
}

const player = new Sprite({x:canvas.width/2 - 40,y:canvas.height*0.75}, 0)


const grids = [new Grid()]
const bullets = []
const enemyBullets = []

// function generateRandom(){
//     let X;
//     X = Math.floor( Math.random() * 30)
//     return X
// }

let frames = 0;
let randomInterval = Math.floor(Math.random()* 500) + 500;
let score = 0;


function animate(){

    window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width,canvas.height)
   
    c.fillStyle = "limegreen"
    c.font = "30px Consolas";
    c.fillText("Score: ", 20,700)
    c.fillText(score, 120,700)
    
    enemyBullets.forEach((enemybullet)=>{
        enemybullet.update()
    })
        grids.forEach((grid,gridIndex)=>{
            grid.update()
            
            
            if (frames % 103.5 === 0 && grid.invaders.length > 0){
                

                grid.invaders[Math.floor(Math.random() * grid.invaders.length )].fire(enemyBullets)
        
                
            }


            grid.invaders.forEach((invader,i) =>{
                
                invader.update({velocity: grid.velocity})
                
                
                    if(keys.w.pressed==true){
                    
                    
                    
                    }
                   
                   
                   
                
                bullets.forEach((bullet,j)=>{
                    if(bullet.location.y <= invader.position.y +40 && bullet.location.x >= invader.position.x && bullet.location.x +5 <invader.position.x +40 ){
                           
                            grid.invaders[i].isDead = true;
                            
                            setTimeout(()=>{grid.invaders.splice(i,1)}, 200)
                            
                            bullets.splice(j,1)
                            
                            score ++;
                    }
                })
            })
        })
    
       
       
    player.update()
    bullets.forEach((bullet) =>{
        bullet.update()

    })
   
    
    if(keys.a.pressed){
        player.velocity = -1.3
    }
    else if(keys.d.pressed){
        player.velocity = 1.3
    }
    else if(!keys.a.pressed){
        player.velocity = 0
    }
    else if(!keys.d.pressed){
        player.velocity = 0
    }

   frames++
}

animate()

window.addEventListener('keypress', (event)=>{
    switch(event.key){
        case ' ':
            keys.Space.pressed = true
            bullets.push( new Bullet({position:{x: player.position.x + 40, y: player.position.y}}))
            break
        case 'w':
            keys.w.pressed = true
            
            break
    }
    
})

window.addEventListener('keydown',(event)=>{
    switch (event.key){
        case 'a':
            keys.a.pressed = true
            break
        case 'd': 
            keys.d.pressed = true
            break



    }
    
})  

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'a':
            keys.a.pressed = false
            break
        case 'd': 
            keys.d.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break

    }
})