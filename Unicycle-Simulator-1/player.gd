extends CharacterBody2D

signal hit

@export var max_speed = 400
@export var jump_speed = 500

@export var wig = false
@export var nose = false
@export var speed = false
@export var jump = false
@export var parachute = false

var animation_pos = 0

var screen_size
var gravity

var mice = [false, false, false]

func _ready() -> void:
	hide()
	screen_size = get_viewport_rect().size
	if wig:
		$wig.show()
	if nose:
		$nose.show()
	
func set_gravity(new_gravity):
	gravity = new_gravity
	
	
func _input(event):
	if event is InputEventScreenTouch:
		var i = -1
		if event.position.y < $"..".get_viewport_rect().size.y / 2:
			i = 0
		elif event.position.x < $"..".get_viewport_rect().size.x / 2:
			i = 1
		else:
			i = 2
		if i != -1:
			mice[i] = event.is_pressed()
	
func is_jump_pressed():
	return (Input.is_action_pressed("jump") or mice[0])

func is_jump_just_pressed():
	return (Input.is_action_just_pressed("jump") or mice[0])
	
func is_right_pressed():
	return (Input.is_action_pressed("move_right") or mice[2])
	
func is_left_pressed():
	return (Input.is_action_pressed("move_left") or mice[1])
	
func _physics_process(delta: float) -> void:
	if ($"..".idle):
		move_and_slide()
		return
	
	if is_right_pressed():
		velocity.x += 30
	elif is_left_pressed():
		velocity.x -= 30
	else:
		velocity.x *= 0.96
	velocity = velocity.clamp(-Vector2(max_speed, INF), Vector2(max_speed, INF))
	
	if is_on_floor():
		animation_pos += velocity.x
	$AnimatedSprite2D.frame = int(animation_pos / 3000) % 4
	
	$parachute.hide()
	if !is_on_floor():
		velocity.y += gravity;
		if velocity.y > 125 and parachute and $"..".level != 6 and is_jump_pressed():
			velocity.y = 125
			$parachute.show()
			
	if is_on_floor() && is_jump_just_pressed():
		velocity.y = -jump_speed;
	
	if position.y > 700:
		$".."._on_player_hit(null)
	
	for body in $Area2D.get_overlapping_areas():
		if body.is_in_group("coin"):
			$".."._on_player_coin(body)
		elif body.is_in_group("spike"):
			$".."._on_player_hit(body)
		elif body.is_in_group("trampoline"):
			$".."._on_player_trampoline(body)
		elif body.is_in_group("banner"):
			$".."._on_player_banner(body)
		elif body.is_in_group("goal"):
			$".."._on_player_goal(body)
	
	move_and_slide();

func _on_body_entered(body: Node2D) -> void:
	hide()
	hit.emit()
	$Area2D/CollisionShape2D.set_deferred("disabled", true)
	$CollisionShape2D2.set_deferred("disabled", true)

func start(pos):
	gravity = 8
	position = pos
	velocity = Vector2.ZERO
	show()
	$Area2D/CollisionShape2D.disabled = false
	$CollisionShape2D2.disabled = false
	
func boing():
	velocity.y = -jump_speed * 1.3;
	
func don_wig():
	wig = true;
	$wig.show()

func don_nose():
	nose = true;
	$nose.show()
	
func don_speed():
	max_speed = 800
	speed = true
	
func don_jump():
	jump_speed = 800
	jump = true
