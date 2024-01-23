// Objects
const player = {
    obj: document.getElementById('personagem'),
    posX: 0,
    posY: 98,
    velocidadeX: 0,
    velocidadeY: 0,
    parado: 'Samurai/Idle.gif',
    andando: 'Samurai/Walk.gif',
    pulando: 'Samurai/Jump.gif',
    morrendo:'Samurai/Dead.gif',
    morto:'Samurai/morto.png',
    defesa:'Samurai/block.png',
    ataque: ['Samurai/sunatk.gif', 'Samurai/estocada.gif'],
    teclaPressionada: { 'a': false, 'd': false, 'w': false },
    isJump: false,
    direcao: 0,
    estadoAtual: 'parado',
    cortando: false,
    dano: false,
    vivo: true,
    block: false,
    dano: 0,
    vida: 50,
};

const inimigo = {
    obj: document.getElementById('inimigo'),
    velocidade: 0,
    x: 1200,
    direcao: 1,
    parado: 'Robo/Idle.gif',
    andando: 'Robo/Walk.gif',
    ataque: ['robo/atirando.gif', 'robo/batendo.gif'],
    hit: 'robo/Hurt.gif',
    morrido: 'robo/morto.png',
    morrendo: 'Robo/morrendo.gif',
    estatirando: false,
    estaBatendo: false,
    estapanhando: false,
    movendo: false,
    estadoAtual: 'parado',
    vivo: true,
    vida: 50,
    dano: 0,
}

let atk = 0

var intervaloTiro = setInterval(tiro, 2000);
var intervalosoco = setInterval(soco, 1000);

function soco() {
    if (player.vivo && inimigo.vivo) {
        const distanciaMinimaSoco = 100;

        // Verifica se o jogador está perto o suficiente para socar
        const distanciaX = Math.abs(player.posX - inimigo.x);
        const direcaoDoInimigo = inimigo.direcao;

        if (
            (direcaoDoInimigo === 0 && player.posX > inimigo.x && distanciaX <= distanciaMinimaSoco) ||
            (direcaoDoInimigo === 1 && player.posX < inimigo.x && distanciaX <= distanciaMinimaSoco)
        ) {
            inimigo.movendo = false;
            inimigo.estaBatendo = true;

            setTimeout(function () {
                if (
                    (direcaoDoInimigo === 0 && player.posX > inimigo.x && Math.abs(player.posX - inimigo.x) <= 150) ||
                    (direcaoDoInimigo === 1 && player.posX < inimigo.x && Math.abs(player.posX - inimigo.x) <= 150)
                ) {
                    inimigo.dano = 5
                    hit();
                }
                inimigo.estaBatendo = false;
                inimigo.movendo = true;
            }, 250);
        }
    }
}


//pei pei pei inimigo
function tiro() {
        if (player.vivo && !inimigo.estapanhando && !inimigo.estaBatendo && inimigo.vivo) {
            inimigo.velocidade = 0;
            inimigo.movendo = false;
    
            inimigo.estatirando = true;
    
    
        //criar bala
        let tela = document.getElementById('display')
        let bala = document.createElement('img');
        bala.setAttribute('class', 'bala'); 
        bala.src = 'robo/bala.gif';
        tela.appendChild(bala)
    
        bala.style.left = inimigo.x + 'px'
        bala.style.zIndex = '-2'
        
    
        // Aguarde 2 segundos e, em seguida, redefina o estado de tiro e o movimento do inimigo
        setTimeout(function () {
    
    //moverbala
            let balaPos = inimigo.x;
            bala.style.zIndex = '2'
        let balaV = 0
        if (inimigo.direcao === 1){ 
            balaV -= 15
            bala.style.transform = 'scaleX(-1)'
        } else {
            balaV += 15
            bala.style.transform = 'scaleX(1)'
        }
    
        function MoverBala() {
        if (!inimigo.estapanhando && !inimigo.estaBatendo){
            balaPos += balaV
           
            bala.style.left = balaPos + 'px';

         if ( balaPos >= player.posX &&
                balaPos <= player.posX + player.obj.offsetWidth && 
                player.posY <= 190 && player.cortando){
                    tela.removeChild(bala);
                } else if (
                balaPos >= player.posX &&
                balaPos <= player.posX + player.obj.offsetWidth && 
                player.posY <= 190
            ) {
                tela.removeChild(bala);
                inimigo.dano = 10
                hit()
            } 
    
            // Verifica se a bala atingiu a borda da tela
            if (balaPos > tela.width || balaPos <= 0) {
               
                tela.removeChild(bala);
            } else {
                requestAnimationFrame(MoverBala);
            }
         } else { tela.removeChild(bala)}
            
    }
    
        MoverBala();
    
            inimigo.estatirando = false;
            inimigo.movendo = true;
        }, 800);
    }
}


//move o inimigo na direção do Player
function MoverInimigo() {
    const distanciaMinima = 10

    if (inimigo.vida <= 0){
        inimigo.vivo = false
    }


    if(inimigo.vivo){
    // Verifica se o inimigo está a uma distância mínima do jogador
    if (Math.abs(player.posX - inimigo.x) > distanciaMinima) {
        if (inimigo.estatirando || inimigo.estaBatendo || inimigo.estapanhando) {
            inimigo.velocidade = 0;
        } else if (player.posX < inimigo.x) {
            inimigo.direcao = 1;
            inimigo.velocidade = -2;
            inimigo.movendo = true;
            direcaoInimigo();
        } else if (player.posX > inimigo.x) {
            inimigo.direcao = 0;
            inimigo.velocidade = 2;
            inimigo.movendo = true;
            direcaoInimigo();
        } else {
            inimigo.velocidade = 0; // Permanece parado se estiver na mesma posição
            inimigo.movendo = false;
        }
    } else {
        // O inimigo está muito próximo do jogador, pare de se mover
        inimigo.velocidade = 0;
        inimigo.movendo = false;
    }
}
}

//controla as animações do inimigo
function animacaoInimigo() {
    let novaImagem;
    if (player.vivo){
        if (!inimigo.vivo){
            novaImagem = inimigo.morrido;
        } else if (inimigo.estapanhando){
        novaImagem = inimigo.hit
      } else if (inimigo.movendo) {
        novaImagem = inimigo.andando
    } else if (inimigo.estaBatendo){
        novaImagem = inimigo.ataque[1]
    } else if (inimigo.estatirando) {
       novaImagem = inimigo.ataque[0];
    } else {
         novaImagem = inimigo.parado;
    }  
} else {
    novaImagem = inimigo.parado;
}  
    

    // Verificar se a imagem mudou antes de definir novamente
    if (inimigo.estadoAtual !== novaImagem) {
        inimigo.obj.src = novaImagem;
        inimigo.estadoAtual = novaImagem;
    }
}

// controla o sprite do inimigo
function direcaoInimigo() {
    if (inimigo.direcao === 0) {
        inimigo.obj.style.transform = 'scaleX(1)';
    } else if (inimigo.direcao === 1) {
        inimigo.obj.style.transform = 'scaleX(-1)';
    }
}
//physics
let gravity = 0.5;

//muda o sprite do Player
function controleDirecao() {
    if (player.vivo){
        if (player.direcao === 0) {
        player.obj.style.transform = 'scaleX(1)';
    } else if (player.direcao === 1) {
        player.obj.style.transform = 'scaleX(-1)';
    }
    }
   
}

let barraVida = document.getElementById("vida");
barraVida.style.width = player.vida + "%"

function hit() {
    if (player.vivo){
        if (player.block && player.direcao != inimigo.direcao) {
        // O jogador está defendendo na direção do inimigo
        return;
    } else {
        player.vida -= inimigo.dano
        barraVida.style.width = player.vida + "%"; 

        player.obj.style.filter = 'brightness(0) invert(1) grayscale(100%) brightness(2)';
        if (inimigo.direcao == 1){
            player.velocidadeX = -10
        } else {
            player.velocidadeX = 10
        }

        setTimeout(function () {
            player.velocidadeX = 0
            player.obj.style.filter = 'none'; // Remover o filtro após 200 milissegundos
            player.dano = false;
        }, 100);

    }

        if (player.vida <= 0) {
            player.vivo = false;
            barraVida.style.width = 0 + 'px'
        }
    }
}

let anos = 0; 

// Controla as animações do player
function controleAnimacao() {
    let novaImagem;

    if (!player.vivo) {
        if (anos > 600) {
            novaImagem = player.morto;
        } else {
            novaImagem = player.morrendo;
        }

        // Incrementa o contador de tempo após a morte
        anos += 16; 
        
    } else if (player.block){
        novaImagem = player.defesa
    } else if (player.cortando) {
        novaImagem = player.ataque[atk]
    } else if (player.isJump) {
        novaImagem = player.pulando;
    } else if (player.teclaPressionada['a'] || player.teclaPressionada['d']) {
        novaImagem = player.andando;
    } else {
        novaImagem = player.parado;
    }

    // Verificar se a imagem mudou antes de definir novamente
    if (player.estadoAtual !== novaImagem) {
        player.obj.src = novaImagem;
        player.estadoAtual = novaImagem;
    }
}

//respiração do gay
function cortes() {
    if (player.vivo) {
        player.cortando = true;
        if (atk == 0){
            player.obj.style.height = 235 + 'px';
        }
        

        setTimeout(function () {
            const distanciaMinimaAtaque = 150;
        if ( player.posX + distanciaMinimaAtaque >= inimigo.x && player.direcao != inimigo.direcao) {
            player.dano = 10
            hitInimigo()
        }
        }, 200);
        

        setTimeout(function () {
            player.cortando = false;
            player.obj.style.height = 150 + 'px';
        }, 400);
    }
}

let Ebarra = document.getElementById("enemyLife");

//dano inimigo
function hitInimigo() {
    setTimeout(function () {
        inimigo.vida -= player.dano
        Ebarra.style.width = inimigo.vida + "%"
        inimigo.estapanhando = false
    }, 500);

    inimigo.estapanhando = true
}

//aumenta pos do Player com a speed e chama o movimento do player
function atualizarMovimento() {
    if (player.vivo){
        MoverInimigo();  
        inimigo.x += inimigo.velocidade; 
    if (!player.block && !player.cortando){
    player.posX += player.velocidadeX;
    player.posY += player.velocidadeY;  
    player.velocidadeY -= gravity;
    }
} else {
        player.posY = 98
    }
    // Verificar se o jogador atingiu o chão (posição Y mínima)
    if (player.posY < 98) {
        player.posY = 98;
        player.velocidadeY = 0;
        player.isJump = false;
    }

    atualizarPosicao();
}

//Move o player
function atualizarPosicao() {
    player.obj.style.left = player.posX + 'px';
    player.obj.style.bottom = player.posY + 'px';

    inimigo.obj.style.left = inimigo.x + 'px'
}

//ouvinte para quando uma tecla é pressionada
document.addEventListener('keydown', function (event) {
    switch (event.key.toLowerCase()) {
        case 'a':
            if (!player.cortando){
            player.velocidadeX = -5;
            player.teclaPressionada['a'] = true;
            player.direcao = 1;
            }
            break;
        case 'd':
            if (!player.cortando){
            player.velocidadeX = 5;
            player.teclaPressionada['d'] = true;
            player.direcao = 0;
            }
            break;
        case 'w':
            if (player.posY === 98) {
                player.velocidadeY = 12;
                player.isJump = true;
            }
            break;
        case 'q': 
            if (!player.isJump && !player.cortando){
                player.block = true
            }
            break
        case 'e': 
            if (!player.isJump && !player.cortando && !player.block){
                atk = 0
                cortes()
            }
                break
        case 'f': 
        if (!player.isJump && !player.cortando && !player.block){
            atk = 1
            cortes()
            }
    }
    controleDirecao();
});

//ouvinte para quando uma tecla é solta
document.addEventListener('keyup', function (event) {
    switch (event.key.toLowerCase()) {
        case 'a':
            player.teclaPressionada['a'] = false;
            if (!player.teclaPressionada['d'] ){ player.velocidadeX = 0}
            break;
        case 'd':
            player.teclaPressionada['d'] = false;
            if (!player.teclaPressionada['a']){ player.velocidadeX = 0}
            break;
        case 'q': player.block = false
    }
});

//Autoexplicativo lolololololol
function loopJogo() {
    controleAnimacao();
    atualizarMovimento();
    animacaoInimigo()
    
    requestAnimationFrame(loopJogo);
}

loopJogo();
