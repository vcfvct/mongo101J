//Final 1
db.messages.find({ 'headers.From': 'andrew.fastow@enron.com', 'headers.To': 'jeff.skilling@enron.com' }).count()


// Final 2, use $addToSet to remove dups from the 'headers.To' list
// if the collection is to large, we could add '{allowDiskUse:true}' as the 2nd param of aggregate() function after the [].
db.messages.aggregate([{
    $project: { headers: '$headers' }
}, {
    $unwind: '$headers.To'
}, {
    $group: { _id: '$_id', from: { $first: '$headers.From' }, to: { $addToSet: '$headers.To' } }
}, {
    $unwind: '$to'
}, {
    $group: { _id: { from: '$from', to: '$to' }, sum: { $sum: 1 } }
}, {
    $sort: { sum: -1 }
}, {
    $limit: 10
}])


//Final 3
db.messages.update({'headers.Message-ID': '<8147308.1075851042335.JavaMail.evans@thyme>'}, {$push: {'headers.To': 'mrpotatohead@mongodb.com'}})


//Finra 7 --- import
mongoimport -d final7 -c albums <albums.json --batchSize 1 
mongoimport -d final7 -c images <images.json --batchSize 1

//Finra 7 --- code. Execute with 'mongo FileName.js'
var dbString = '127.0.0.1:27017/final7';
var db = connect(dbString);
print('* Connected to the ' + dbString);

var albums = db.albums.find();
var validImages = {};
albums.forEach(function(album){
	album.images.forEach(function(imageId){
		if(!validImages[imageId]){
			validImages[imageId] = 1;
		}
	});
});

var targetImages = db.images.find({tags: {$in: ['sunrises']}});
var orphanCount = 0;
var totalCount = 0;
targetImages.forEach(function(image){
	totalCount++;
	if(!validImages[image._id]){
		orphanCount++;
	}
});
print('Total images with sunrises: ' + totalCount);
print('Total Orphan images with sunrises: ' + orphanCount);
print('Finra 7 answer: ' + (totalCount - orphanCount));
