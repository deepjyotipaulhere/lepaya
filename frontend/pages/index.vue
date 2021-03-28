<template>
  <div>
    <h1 style="text-align:center;color:white">Lepaya Memory Game</h1>
    <h2 style="text-align:center;color:deepskyblue" v-if="gameid">Game ID: {{gameid}}</h2>
    <br>
    <v-card flat class="mx-auto" width="800" v-if="!noofcards">
      <v-card-title>
        <h2>Choose no of Cards to play</h2>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="history">Moves History </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn color="primary" large block style="font-size:xx-large" @click.prevent="selectNoOfCards(4)">4</v-btn>
          </v-col>
          <v-col>
            <v-btn color="primary" large block style="font-size:xx-large" @click.prevent="selectNoOfCards(8)">8</v-btn>
          </v-col>
          <v-col>
            <v-btn color="primary" large block style="font-size:xx-large" @click.prevent="selectNoOfCards(12)">12</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div v-else>

    <v-card  class="mx-auto" width="800" flat color="transparent">
      <v-card-text>
        <v-row>
          <v-col cols="12" lg="3" v-for="(x,i) in cardnos" :key="i">
            <v-card @click.prevent="!showcardnos && cardclick(x)">
              <v-card-text><h1 style="text-align:center;padding:2em 0"><span v-if="showcardnos || cardinputs.includes(x)">{{x}}</span><span v-else>&nbsp;</span></h1></v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" block @click.prevent="play" :disabled="!showcardnos">Play</v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mx-auto" width="300" v-if="!showcardnos">
      <v-card-title>Player move history</v-card-title>
      <v-card-text>
        <v-slide-y-transition
        class="py-0"
        group
        tag="v-list"
      >
    <v-list-item v-for="(x,i) in cardinputs" :key="i">
      <v-list-item-content>
        <v-list-item-title>Player chose {{x}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    </v-slide-y-transition>
      </v-card-text>
    </v-card>
    
    </div>
    <v-dialog v-model="playstat" width="400">
      <v-card>
        <v-card-title>Game Over</v-card-title>
        <v-card-text>
          <h1 :class="win?'success--text':'error--text'">Player {{win?'Wins':'Loses'}}</h1>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text @click.prevent="noofcards=null;cardnos=[];showcardnos=true;cardinputs=[];playstat=false;gameid=null">Restart</v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click.prevent="history">Move History</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showhistory" width="600" scrollable>
      <v-card>
        <v-card-title>
          <h1>Moves History</h1>
        </v-card-title>
        <v-list v-for="(x,i) in Object.keys(movehistory)" :key="i">
          <h3 style="text-align:center">Game ID: {{x}}</h3>
          <v-divider></v-divider>
          <v-list-item v-for="(y,j) in movehistory[x]" :key="j">
            <v-list-item-content>
              <v-list-item-title>{{y.value}}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              {{y.timestamp}}
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      noofcards:null,
      cardnos:[],
      showcardnos:true,
      cardinputs:[],
      playstat:false,
      win:false,
      gameid:null,
      movehistory:[],
      showhistory:false,
      tab:null
    }
  },
  methods:{
    selectNoOfCards(no){
      this.$axios.post("/getcards",{
        size:no
      }).then(response=>{
        this.cardnos=response.data
        this.noofcards=no
      })
    },
    play(){
      this.gameid=Math.ceil(Math.random()*1000)
      this.showcardnos=false
    },
    async cardclick(cardno){
      if(!this.cardinputs.includes(cardno)) await this.cardinputs.push(cardno)
      if (this.cardnos.length==this.cardinputs.length)
      {
        if (JSON.stringify(this.cardnos.sort())===JSON.stringify(this.cardinputs))
          this.win=true
        else
          this.win=false
        this.$axios.post("/save",{
          move: this.cardinputs,
          gameid: this.gameid,
          status: this.win
        })
        this.playstat=true
      }
    },
    history(){
      this.$axios.get("/moves").then(response=>{
        this.movehistory = response.data;
        this.playstat = false;
        this.noofcards = null;
        this.cardnos = [];
        this.showcardnos = true;
        this.cardinputs = [];
        this.gameid = null;
        this.showhistory = true;
      })
    }
  }
}
</script>

<style>

</style>