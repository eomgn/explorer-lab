import './css/index.css'
import IMask from 'imask'

/* ---------------------------------------------------------------------------------------- */

//          cor do cartão - visa ou mastercard - START

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path') // selecionar primeira cor

const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path') // selecionar segunda cor

const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img') // selecionar logo

function setCardType(type) {
   // variavel de cores de acordo com a bandeira
   const colors = {
      visa: ['#2D57F2', '#436D99'],
      mastercard: ['#C69347', '#DF6F29'],
      default: ['#000000', '#bbbbbb']
   }

   ccBgColor01.setAttribute('fill', colors[type][0]) // alterar primeira cor
   ccBgColor02.setAttribute('fill', colors[type][1]) // alterar segunda cor
   ccLogo.setAttribute('src', `cc-${type}.svg`) // alterar logo cor
}

globalThis.setCardType = setCardType

//          cor do cartão - visa ou mastercard - END

/* ---------------------------------------------------------------------------------------- */

//          security code - START
const securityCode = document.querySelector('#security-code') // selecionando o id
const securityCodePattern = {
   // mascara do CVC, sendo no máximo 4 dígitos [dígito = número] [o ZERO é igual a qualquer dígito]
   mask: '0000'
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

//          security code - END

/* ---------------------------------------------------------------------------------------- */

//          expiration date - START

const expirationDate = document.querySelector('#expiration-date')
const expirationDatePattern = {
   mask: 'MM{/}YY',

   // mask: '00{/}00', [ACEITA QUALQUER DIGITO]

   blocks: {
      MM: {
         // mês - mascára de inicio e fim [1 a 12]
         mask: IMask.MaskedRange,
         from: 1, // INICIO
         to: 12 // FIM
      },

      YY: {
         // ano - mascára de inicio e fim [String(new Date().getFullYear()).slice(2) = inicia em 22] e [String(new Date().getFullYear() + 10).slice(2) = finaliza em 32]

         mask: IMask.MaskedRange,
         from: String(new Date().getFullYear()).slice(2), // INICIO  //slice(2) pega os dois ultimos digitos
         to: String(new Date().getFullYear() + 10).slice(2) // FIM
      }
   }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

//          expiration date - END

/* ---------------------------------------------------------------------------------------- */

//          card number - START

const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
   mask: [
      {
         mask: '0000 0000 0000 0000',

         regex: /^4{1,15}/,
         // inicia com 4 seguido de mais 15 digitos

         cardtype: 'visa'
      },
      {
         mask: '0000 0000 0000 0000',

         regex: /(^5[1-5]\d{0,2}|^22[2,9]\d|^2[3-7]\d{0,2}\d{0,12})/,
         /* inicia com 5, seguido de um digito entre 1 e 5 seguido de mais 2 digitos OU inicia com 22 seguido de um digito entre 2 e 9 seguido de mais 1 digito OU inicia com 2 seguido de um digito entre 3 e 7 seguido de mais 2 digitos e seguido por fim de mais 12 digitos */

         cardtype: 'mastercard'
      },
      {
         mask: '0000 0000 0000 0000',
         cardtype: 'default'
      }
   ],

   dispatch: function (appended, dynamicMasked) {
      /* faz o replace aceitando apenas números e tudo que não for número vai ser substituido por vazio "" */
      const number = (dynamicMasked.value + appended).replace(/\D/g, '')

      const foundMasked = dynamicMasked.compiledMasks.find(function (item) {
         return number.match(item.regex)
      })

      return foundMasked
   }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//          card number - END

//* ---------------------------------------------------------------------------------------- */

//          add button - START

const addButton = document.querySelector('#ad-card')

addButton.addEventListener('click', () => {
   alert('Cartão adicionado, jovem padawan!!!')
})

document.querySelector('form').addEventListener('submit', event => {
   event.preventDefault()
})

//          add button - END

//* ---------------------------------------------------------------------------------------- */

//          card-holder - START

const cardHolder = document.querySelector('#card-holder')
cardHolder.addEventListener('input', () => {
   const ccHolder = document.querySelector('.cc-holder .value')

   ccHolder.innerText =
      cardHolder.value.length === 0 ? 'FULANO DA SILVA' : cardHolder.value
})

//          card-holder - END

//* ---------------------------------------------------------------------------------------- */

//          masked CVC - START

securityCodeMasked.on('accept', () => {
   updatesecurityCode(securityCodeMasked.value)
})

function updatesecurityCode(code) {
   const ccSecurity = document.querySelector('.cc-security .value')

   ccSecurity.innerText = code.length === 0 ? '123' : code
}

//          masked CVC  - END

//* ---------------------------------------------------------------------------------------- */

//          masked card number - START

cardNumberMasked.on('accept', () => {
   const cardType = cardNumberMasked.masked.currentMask.cardtype
   setCardType(cardType)

   updatecardNumber(cardNumberMasked.value)
})

function updatecardNumber(number) {
   const ccNumber = document.querySelector('.cc-number')

   ccNumber.innerText = number.length === 0 ? '1234 5678 9012 3456' : number
}

//          masked card number  - END

//* ---------------------------------------------------------------------------------------- */

//          masked expiration - START

expirationDateMasked.on('accept', () => {
   updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
   const ccExpiration = document.querySelector('.cc-extra .value')

   ccExpiration.innerText = date.length === 0 ? '02/32' : date
}
//           masked expiration - END
