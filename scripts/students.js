var dbString = '127.0.0.1:27017/school';
var db = connect(dbString);
print('* Connected to the ' + dbString);

var studentsCur = db.students.find();
var students = [];
studentsCur.forEach(function(student) {
    students.push(student);
});

students.forEach(function(student) {
    var MAX = 1000000;
    var lowScore = student.scores.reduce(function(prev, curr) {
        if (curr.type != 'homework') {
            return prev;
        }
        return curr.score < prev.score ? curr : prev;
    }, {
        score: MAX
    }).score;
    if (lowScore != MAX) {
        //print('Get low Score: ' + lowScore + ' for: ' + student.name); 
        var newScores = student.scores.filter(function(oneScore) {
            return oneScore.type != 'homework' || oneScore.score != lowScore;
        });
        student.scores = newScores;
    }
});

for (var a = 0; a < 5; a++) {
    print(JSON.stringify(students[a]));
}

students.forEach(function(student) {
    db.students.update({_id: student._id}, student, {upsert:true});
});

print('result: ' + db.students.aggregate( { '$unwind' : '$scores' } , { '$group' : { '_id' : '$_id' , 'average' : { $avg : '$scores.score' } } } , { '$sort' : { 'average' : -1 } } , { '$limit' : 1 } ).next()._id);
