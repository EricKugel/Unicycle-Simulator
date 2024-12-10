extends CanvasLayer

var shopping = false

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	for i in 7:
		if i == 0:
			continue
		if $"..".levels[i]:
			if i == 1:
				$level1/level1lock.hide()
			if i == 2:
				$level2/level2lock.hide()
			if i == 3:
				$level3/level3lock.hide()
			if i == 4:
				$level4/level4lock.hide()
			if i == 5:
				$level5/level5lock.hide()
			if i == 6:
				$level6/level6lock.hide()

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _input(event):
	if not shopping and event is InputEventMouseButton and event.pressed:
		if $level1.get_global_rect().has_point(event.position):
			start_level(1)
		elif $level2.get_global_rect().has_point(event.position):
			start_level(2)
		elif $level3.get_global_rect().has_point(event.position):
			start_level(3)
		elif $level4.get_global_rect().has_point(event.position):
			start_level(4)
		elif $level5.get_global_rect().has_point(event.position):
			start_level(5)
		elif $level6.get_global_rect().has_point(event.position):
			start_level(6)
		elif $shop.get_global_rect().has_point(event.position):
			shop()

func start_level(level):
	if ($"..".levels[level]):
		$"..".new_game(level)
		self.queue_free()
	
func shop():
	shopping = true
	var shop = load("res://shop.tscn").instantiate()
	add_child(shop)
