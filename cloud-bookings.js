(function(){
  const fallback={
    apiKey:"AIzaSyCnjoCmmfkJtdSxIHp18yjF1kUkhbsHN3U",
    authDomain:"dog-walk-buddy.firebaseapp.com",
    databaseURL:"https://dog-walk-buddy-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:"dog-walk-buddy",
    storageBucket:"dog-walk-buddy.firebasestorage.app",
    messagingSenderId:"385094228184",
    appId:"1:385094228184:web:f50be4a676e99593e55fad"
  };
  const external=window.DWB_FIREBASE_CONFIG||{};
  const cfg=external.apiKey && external.databaseURL ? external : fallback;
  const ready=!!(cfg.apiKey && cfg.databaseURL);
  window.DWBCloud={enabled:ready,user:null,db:null,auth:null,
    initAdmin:async function(email,password){
      if(!ready) throw new Error("Firebase has not been connected yet.");
      if(!window.firebase) throw new Error("Firebase SDK did not load.");
      if(!firebase.apps.length) firebase.initializeApp(cfg);
      this.auth=firebase.auth(); this.db=firebase.database();
      const cred=await this.auth.signInWithEmailAndPassword(email,password);
      this.user=cred.user; return cred.user;
    },
    initCustomer:async function(){
      if(!ready) throw new Error("Firebase has not been connected yet.");
      if(!window.firebase) throw new Error("Firebase SDK did not load.");
      if(!firebase.apps.length) firebase.initializeApp(cfg);
      this.auth=firebase.auth(); this.db=firebase.database();
      const cred=await this.auth.signInAnonymously();
      this.user=cred.user; return cred.user;
    },
    addBooking:async function(data){
      if(!this.db) throw new Error("Not connected.");
      const ref=this.db.ref("bookings").push();
      await ref.set(Object.assign({},data,{createdAt:firebase.database.ServerValue.TIMESTAMP,status:"Pending"}));
      return ref.key;
    },
    listenBookings:function(cb){
      if(!this.db) return function(){};
      const ref=this.db.ref("bookings");
      const fn=s=>cb(s.val()||{});
      ref.on("value",fn);
      return function(){ref.off("value",fn);};
    },
    updateBooking:async function(id,patch){
      if(!this.db) throw new Error("Not connected.");
      await this.db.ref("bookings/"+id).update(patch);
    }
  };
})();