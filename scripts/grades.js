var dbString = '127.0.0.1:27017/students';
var db = connect(dbString); 
print('* Connected to the ' + dbString);

var lowScoresCur = db.grades.aggregate({'$group':{'_id':'$student_id', 'min':{$min:'$score'}}}, {'$sort':{'min':-1}});
var lowScores = [];
lowScoresCur.forEach(function(doc){
	lowScores.push(doc);
});

print('Get scores size: ' + lowScores.length);

lowScores.forEach(function(doc){
	 print('About to remove: ' + JSON.stringify(doc));
	 db.grades.remove({student_id: doc._id, score: doc.min});
});

print('remaining doc size: ' + db.grades.count());


print('result: ' + db.grades.aggregate({'$group':{'_id':'$student_id', 'average':{$avg:'$score'}}}, {'$sort':{'average':-1}}, {'$limit':1}).next()._id);