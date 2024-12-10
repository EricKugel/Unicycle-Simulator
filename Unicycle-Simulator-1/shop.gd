extends CanvasLayer

func _ready() -> void:
	$coins.text = "%d" % $"../..".coins

func _input(event):
	if event is InputEventMouseButton and event.pressed:
		if $wig.get_global_rect().has_point(event.position):
			buy_wig()
		elif $nose.get_global_rect().has_point(event.position):
			buy_nose()
		elif $speed.get_global_rect().has_point(event.position):
			buy_speed()
		elif $jump.get_global_rect().has_point(event.position):
			buy_jump()
		elif $parachute.get_global_rect().has_point(event.position):
			buy_parachute()
		elif $level6.get_global_rect().has_point(event.position):
			buy_level6()
		elif $back.get_global_rect().has_point(event.position):
			back()
		$coins.text = "%d" % $"../..".coins
			
func buy_wig():
	if not $"../../Player".wig and $"../..".coins >= 10:
		$"../..".coins -= 10
		$"../../Player".don_wig()
	
func buy_nose():
	if not $"../../Player".nose and $"../..".coins >= 20:
		$"../..".coins -= 20
		$"../../Player".don_nose()
	
func buy_speed():
	if not $"../../Player".speed and $"../..".coins >= 100:
		$"../..".coins -= 100
		$"../../Player".don_speed()
			
func buy_jump():	
	if not $"../../Player".jump and $"../..".coins >= 100:
		$"../..".coins -= 100
		$"../../Player".don_jump()
	
func buy_parachute():	
	if not $"../../Player".parachute and $"../..".coins >= 200:
		$"../..".coins -= 200
		$"../../Player".parachute = true

func buy_level6():
	if $"../..".levels[5] and not $"../..".levels[6] and $"../..".coins >= 300:
		$"../..".coins -= 300
		$"../..".levels[6] = true
		$"../level6/level6lock".hide()
	
func back():
	$"..".shopping = false
	self.queue_free()
