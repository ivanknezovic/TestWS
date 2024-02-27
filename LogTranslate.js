class LineClass {
  constructor(Date, Description, NewValue,OldValue,Type,User,ID) {
  this.Date = Date
  this.Description = Description;
  this.OldValue = OldValue;
  this.NewValue = NewValue;
  this.Type = Type;
  this.User = User;
  this.ID = ID;
}
}

//Translate log book
function TranslateLogList(LogList){
  
  const newList = [];
 var StrToTr="";
  if(LogList==null ) return newList;


  LogList.forEach((element) => 
  {
    const parts = element.Line.split(";");
    
    if(parts.length>1)
    {
      let Line=new LineClass(element.Date, "Description","0","0","0","User","0");
      // console.log("case: " + parts[0]);
      
      switch(parts[0]) 
      {
        // case "0": //(*Error Message. J-Son St.: key; Fehler.Index in Error-array*)
        //   if ((parts.length > 1) && (parts[1] != null))
        //       Line.Description = TranslateFromJson(parts[1]);                                        //Text 1
        //   if ((parts.length > 2) && (parts[2] != null))
        //       Line.Description = Line.Description.concat( " ", TranslateFromJson(parts[2]));        //Text 2
        //   if ((parts.length > 3) && (parts[3] != null))
        //       Line.NewValue = parts[3];                  //Value 1
        //   if ((parts.length > 4) && (parts[4] != null))
        //       Line.OldValue = parts[4];                  //Value 2   
        //       break;  
              
      case "1":       //*Machine State (from machine). J-Son Structure: Key; State*)
              Line.ID = 1;
              console.log("case 1")
              if ((parts.length > 1) && (parts[1] != null))
              {
                StrToTr="";
                StrToTr=StrToTr.concat("StandstillReasonId_",(parts[1]));
                Line.Description = TranslateFromJson(StrToTr);
              }
                 
              if ((parts.length > 2) && (parts[2] != null))
                  Line.Description = Line.Description.concat( "     ", parts[2]);
              if ((parts.length > 3) && (parts[3] != null))
                  Line.Description = Line.Description.concat( "     ", parts[3]);
          
              Line.Type = "STATE";
              break;
      case "2":  //*Machine State (input bay User). J-Son Structure: Key; State*)
              Line.ID = 2;
              if ((parts.length > 1) && (parts[1] != null))
              {
                StrToTr="";
                StrToTr=StrToTr.concat("CTRLVIS_MachStatM_",(parts[1]));
                Line.Description = TranslateFromJson(StrToTr);
              }          
              if ((parts.length > 2) && (parts[2] != null))
              Line.Description = Line.Description.concat( "     ", parts[2]);
              if ((parts.length > 3) && (parts[3] != null))
              Line.Description = Line.Description.concat( "     ", parts[3]);
                
              Line.Type = "STATE";
              break;

      // case "3":  //User login    (*User-login. J-Son Structure: key; New User; Last User ; Acess Level*)
      //     Line.ID = 3;

      //   if (parts.length > 3)
      //   {
      //   if (parts[1].Length <= 0)
      //     {
      //       Line.Description = TranslateFromJson("TX_LOGOUT");

      //       if (parts[2].Length > 1)         //Logout User
      //           Line.User = parts[2];
      //     }
      //     else
      //     {
      //       Line.Description = TranslateFromJson("TX_LOGIN");
      //       if (parts[3].Length > 0)
      //           Line.Description = Line.Description.concat( " ",TranslateFromJson("Access_Level"), " ", parts[3]);
                
      //           if (parts[2].Length > 1)         //Logout User
      //             Line.User = parts[2];
      //     }
      //   }
      //   Line.Type = "USER";
      // break;

      // case "4":  //Parameter    Param Change. J-Son St.: key; Text 1; Text 2 ; New val; Old val; USername
      //   Line.ID = 4;

      //   if (parts.length > 5)
      //   {
      //     Line.Description = TranslateFromJson(parts[1]);   //text 1

      //     if (parts[2].Length > 1)         //Text 2
      //       Line.Description = Line.Description.concat( " ", TranslateFromJson(parts[2]));
      //     if (parts[3].Length > 0)         //New
      //       Line.NewValue = parts[3];
      //     if (parts[4].Length > 0)         //Old
      //       Line.OldValue = parts[4];
      //     if (parts[5].Length > 1)         //User Name
      //       Line.User = parts[5];
      //   }
      //   Line.Type = "PARAM";
      // break
            
      default:
              Line.Description="Description";
      break;
      }

      Line.Date=element.Date;
      newList.push(Line);
    }
  })
  return newList;
}

  //Translate from Translation Json
  function TranslateFromJson(StringTotranslate){
    var translated="Translated";
    $.getJSON('./v_translations.js', (data) => {
      //Meppe zuerst auf "key" und "en"
        var mapped =data.map(function(obj) {
          return {
            "Key": obj.Key,
            "en": obj.en,
                 };
          
        });
        
        // console.log(mapped);        //Hier zeigt er paar Key: calcul  en: calculate
        //Filtere auf "Key" und dann nochmal meppen-damit Auflistung  in Array
         var mappedkey =(mapped.filter((element)=>element.Key==StringTotranslate)).map(function(obj) {
          return {
            "Key": obj.Key,
            "en": obj.en,
                 };               
        });

        console.log(mappedkey);
        mappedkey.forEach((element) => {    //Beschränke nur auf  "rechne/calculate"   
          {
            console.log("Translated element:" +element.en); 
            translated=element.en;
            console.log("Translated 0:" +translated); 
            //return translated;
          }
       
        });
      });
      console.log("Translated 1:" +translated); 
      return translated;

  }
  
  //Create Table
  function createLogTable(LogArr) {

    var header = new Array ("Date","Description", "Type", "NewValue", "OldValue", "User","ID");
    var myTable     = document.createElement("table");
    var mytablebody = document.createElement("tbody");

    const headerRow = document.createElement("tr");
    header.forEach((headerText) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = headerText;
      headerRow.append(headerCell);
    });
    mytablebody.appendChild(headerRow);

    LogArr.forEach((element) =>{      

      currentRow = document.createElement("tr");
      
        currentCell = document.createElement("td");	
        currentText = document.createTextNode(element.Date);
        currentCell.appendChild(currentText);
        currentRow.appendChild(currentCell);

        currentCell = document.createElement("td");	
        currentText = document.createTextNode(element.Description);
        currentCell.appendChild(currentText);
        currentRow.appendChild(currentCell);

        currentCell = document.createElement("td");	
        currentText = document.createTextNode(element.Type);
        currentCell.appendChild(currentText);
        currentRow.appendChild(currentCell);

        currentCell = document.createElement("td");	
        currentText = document.createTextNode(element.NewValue);
        currentCell.appendChild(currentText);
        currentRow.appendChild(currentCell);

        currentCell = document.createElement("td");	
        currentText = document.createTextNode(element.OldValue);
        currentCell.appendChild(currentText);
        currentRow.appendChild(currentCell);

        currentCell = document.createElement("td");	
        currentText = document.createTextNode(element.User);
        currentCell.appendChild(currentText);
        currentRow.appendChild(currentCell); 
        
        currentCell = document.createElement("td");	
        currentText = document.createTextNode(element.ID);
        currentCell.appendChild(currentText);
        currentRow.appendChild(currentCell);
      
      mytablebody.appendChild(currentRow);
    })


    myTable.appendChild(mytablebody);
    return myTable;
  }


  
  
