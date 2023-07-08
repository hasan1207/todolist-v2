//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];





//const mongoURL = 'mongodb://0.0.0.0:27017/todolistDB';
const mongoURL = 'mongodb+srv://hasan07122002:Zq7XLhasan@cluster0.yjtiljz.mongodb.net/todolistDB';
 
// Connect to MongoDB
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function() {
    console.log('Connected to MongoDB');
    // Start your application logic here
  }).catch(function(error) {
    console.error('Error connecting to MongoDB:', error);
  });

  const itemsSchema = new mongoose.Schema({
    name: String
  }, { versionKey: '__v' });

  const Item = mongoose.model("Item", itemsSchema);

  const readReport = new Item({name: "Read Report"});
  const createPortfolio = new Item({name: "Create Portfolio"});
  const publishBook = new Item({name: "Publish Book"});

  const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
    
  }, { versionKey: '__v' });

  const List = mongoose.model("List", listSchema);  


  app.get("/", function(req, res) {

    Item.find({}).then(function(items){
      //console.log(items);
      if(items.length === 0){
        Item.insertMany([readReport, createPortfolio, publishBook]).then(function(){
          console.log("Successfully inserted items into collection");
        }).catch(function (err){
          console.log(err);
        });
        res.redirect("/");
      }
      else{
        res.render("list", {listTitle: "Today", newListItems: items});
      }
      
  }).catch(function(err){
      console.log(err);
  });

    // res.render("list", {listTitle: "Today", newListItems: items});
  
  });
  
  app.post("/", function(req, res){
  
    const item = req.body.newItem;
    const listName = req.body.list;
  
    // if (req.body.list === "Work") {
    //   workItems.push(item);
    //   res.redirect("/work");
    // } else {
    //   items.push(item);
    //   res.redirect("/");
    // }

    const itemObj = new Item({name: item});

    if(item.length > 0){
      if(listName === "Today"){
        
        itemObj.save();
        res.redirect("/");  
      }
      else{
        List.findOne({name: listName}).then(function(list) {
          list.items.push(itemObj);
          list.save();
          res.redirect("/" + listName);
        })
      }
      
    }

    
  });
  
  app.get("/work", function(req,res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
  });
  
  app.get("/about", function(req, res){
    
    res.render("about");
  });

  app.post("/delete", function(req, res) {
    //console.log(req.body);
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    //console.log(checkedItemId);
    console.log(listName);

    if(listName === "Today"){
      Item.findByIdAndRemove(checkedItemId).then(function() {
        console.log("Successfully deleted item");
      }).catch(function(err) {
        console.log(err);
      });
      res.redirect("/");
    }
    else{
      // List.findOne({ name: listName }).then((list) => {
      //   Item.findByIdAndRemove(checkedItemId).then(() => {

      //   }).catch((err) => {
      //     console.log(err);
      //   });
      // });
      List.findOneAndUpdate({ name: listName }, {$pull: {items: {_id: checkedItemId}}}).then(function(list) {
        res.redirect("/" + listName);
      }).catch(function(list) {
        console.log(err);
      });

      
    }
    
  });


  // app.post("/delete", async (req, res) => {
  //   try {
  //     const checkedItemId = req.body.checkbox;
  //     const listName = req.body.listName;
  //     if (listName === date.getDate()) {
  //       await Item.findByIdAndDelete(checkedItemId);
  //       console.log("Successfully deleted checked item.");
  //       res.redirect("/");
  //     } else {
  //       const foundList = await List.findOne({ name: listName });
  //       foundList.items.pull({ _id: checkedItemId });
  //       await foundList.save();
  //       res.redirect("/" + listName);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send("Internal Server Error")
  //   }
  // });

//   app.get("/:customListName", function(req, res) {
//     const customListName = _.capitalize(req.params.customListName);

//     let exists = false;

//     // List.findOne({name: customListName}).then((list) => {
//     //   if(list != null){
//     //     console.log(list);
//     //     exists = true;
//     //     console.log("exists is true");
//     //   }
//     //   else{
//     //     console.log("exists is false");
//     //   }
//     // }).catch((err) => {
//     //   console.log(err);
//     // });



//     List.findOne({ name: customListName })
//             .then(function(result) {
//                 if (result != null) {
//                     //console.log("match found");   
//                     //exists = true;
//                     res.render("list", {listTitle: result.name, newListItems: result.items});
//                 } else {
//                     //console.log("Not found");
//                     const list = new List({
//                       name: customListName,
//                       items: [readReport, createPortfolio, publishBook]
//                     });

//                     list.save();
//                     res.redirect("/" + customListName);
//                 }
//             })
//             .catch(function(error) {
//                 console.log("ERROR:", error);
//             });



//     //         let exists = false;

//     //         List.findOne({ name: customListName })
//     //         .then((result) => {
//     //             if (result != null) {
//     //                 exists = true;
//     //             }
//     //         })
//     //         .catch((error) => {
//     //             console.log("ERROR:", error);
//     //         });



//     // if(exists == false){
//     //   const list = new List({
//     //     name: customListName,
//     //     items: [readReport, createPortfolio, publishBook]
//     //   });
  
//     //   list.save();
//     // }
// //res.redirect("/");
    
//   });




// app.get("/:customList", function (req, res) {
//   const custList = _.capitalize(req.params.customList);
//   if (custList !== "Favicon.ico") {
//     List.findOne({ name: custList }, function (err, result) {
//       if (!result) {
//         const defItems = new Clist({
//           name: custList,
//           items: [buyFood, cookFood, eatFood, defFood],
//         });
//         defItems.save();
//         res.redirect("/" + custList);
//       } else {
//         res.render("index", { listItem: result.name, newItems: result.items });
//       }
//     });
//   }
// });

app.get("/:customList", function (req, res) {
  const custList = _.capitalize(req.params.customList);
  if (custList !== "Favicon.ico") {
    List.findOne({ name: custList }).then(function (result) {
      if (!result) {
        const defItems = new List({
          name: custList,
          items: [readReport, createPortfolio, publishBook],
        });
        defItems.save();
        res.redirect("/" + custList);
      } else {
        res.render("list", { listTitle: result.name, newListItems: result.items });
      }
    }).catch(function(err){
      console.log(err);
    });
  }
});


    // List.findOne({ name: customListName })
    //         .then(function(result) {
    //             if (result != null) {
    //                 //console.log("match found");   
    //                 //exists = true;
    //                 res.render("list", {listTitle: result.name, newListItems: result.items});
    //             } else {
    //                 //console.log("Not found");
    //                 const list = new List({
    //                   name: customListName,
    //                   items: [readReport, createPortfolio, publishBook]
    //                 });

    //                 list.save();
    //                 res.redirect("/" + customListName);
    //             }
    //         })
    //         .catch(function(error) {
    //             console.log("ERROR:", error);
    //         });


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
