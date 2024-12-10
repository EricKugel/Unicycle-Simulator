extends Node2D

@export var block_scene: PackedScene

@export var coins = 0
var level = 1
@export var idle = true

var player

var pos

@export var levels = [null, true, false, false, false, false, false];
#@export var levels = [null, true, true, true, true, false, false];

var blocks = {
	"s": preload("res://spike.tscn"),
	"d": preload("res://dirt.tscn"),
	"g": preload("res://grass.tscn"),
	"_": preload("res://stone.tscn"),
	"$": preload("res://coin.tscn"),
	"t": preload("res://trampoline.tscn"),
	"h": preload("res://h_thing.tscn"),
	"q": preload("res://q_thing.tscn"),
	"b": preload("res://banner.tscn"),
	"p": preload("res://pole.tscn"),
	"f": preload("res://goal.tscn"),
	"r": preload("res://red_banner.tscn")
}

var backgrounds = {
	1: load("res://lib/images/background.png"),
	2: preload("res://lib/images/background1.png"),
	3: preload("res://lib/images/background.png"),
	4: preload("res://lib/images/background.png"),
	5: preload("res://lib/images/background.png"),
	6: preload("res://lib/images/background2.png")
}

func set_coins(new_coins):
	coins = new_coins;
	$CanvasLayer/Label.text = "%d" % coins

func set_level(new_level):
	level = new_level

func new_game(new_level):
	for block in get_tree().get_nodes_in_group("block"):
		block.queue_free()
	level = new_level
	player.start($StartPosition.position)
	pos = $StartPosition.position
	if level == 6:
		player.set_gravity(3.7)
	init_level()
	idle = false

func init_level():
	$CanvasLayer/Background.texture = backgrounds[level]
	$CanvasLayer/Label.text = "%d" % coins
	if level == 2:
		$Player/Camera2D.limit_top = 0
	var file = FileAccess.open("res://lib/levelFiles/level%d.txt" % level, FileAccess.READ)
	var level_data = file.get_as_text()
	level_data = level_data.replace("\t", "    ");
	level_data = level_data.split("\n")
	for y in len(level_data):
		for x in len(level_data[y]):
			var block_type = level_data[y][x]
			if block_type in blocks:
				var block = blocks[block_type].instantiate()
				block.position = Vector2(x * 40 + 20, y * 40 + 20)
				add_child(block);

func restart():
	player.start(pos)
	if level == 6:
		player.set_gravity(3.7)

func _ready() -> void:
	show_logo()
	player = $Player
	pos = $StartPosition.position
	show_select()

func _on_player_hit(spike):
	show_ouch()
	restart()
	
func show_ouch():
	var ouch = load("res://ouch.tscn").instantiate()
	add_child(ouch)
	await get_tree().create_timer(2).timeout
	ouch.queue_free()
	coins -= 10;
	coins = max(0, coins)
	$CanvasLayer/Label.text = "%d" % coins
	
func _on_player_trampoline(trampoline):
	player.boing();
	
func _on_player_coin(coin):
	coin.queue_free()
	coins += 1;
	$CanvasLayer/Label.text = "%d" % coins
	
func _on_player_banner(banner):
	pos = banner.position;
	var new_banner = blocks["r"].instantiate()
	new_banner.position = pos
	add_child(new_banner)
	banner.queue_free()
	
func show_yay():
	var yay = load("res://yay.tscn").instantiate()
	add_child(yay)
	await get_tree().create_timer(2).timeout
	yay.queue_free()
	if level == 6:
		show_gg()
	
func show_gg():
	var gg = load("res://gg.tscn").instantiate()
	add_child(gg)
	await get_tree().create_timer(2).timeout
	get_tree().quit()
	
func show_logo():
	var logo = load("res://logo.tscn").instantiate()
	add_child(logo)
	await get_tree().create_timer(2).timeout
	logo.queue_free()
	
func show_select():
	var select = load("res://select.tscn").instantiate()
	add_child(select)
	
func _on_player_goal(goal):
	if not idle:
		idle = true
		for goal1 in get_tree().get_nodes_in_group("goal"):
			goal1.queue_free()
		if level < 5:
			levels[level + 1] = true
		show_yay()
		show_select()
