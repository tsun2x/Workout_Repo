<?php
// workouts.php - Proxy to ExerciseDB v1 API
// Usage examples:
//   GET workouts.php?action=list&offset=0&limit=10&search=cardio
//   GET workouts.php?action=search&q=bench%20press&offset=0&limit=10&threshold=0.3
//   GET workouts.php?action=filter&muscles=chest,triceps&equipment=dumbbell&bodyParts=upper%20arms&offset=0&limit=10&sortBy=name&sortOrder=asc
//   GET workouts.php?action=by_id&id=ztAa1RK
//   GET workouts.php?action=by_muscle&muscle=abs&offset=0&limit=10&includeSecondary=false
//   GET workouts.php?action=by_bodypart&bodyPart=upper%20arms&offset=0&limit=10
//   GET workouts.php?action=by_equipment&equipment=dumbbell&offset=0&limit=10

// Include CORS headers (and DB connection if needed elsewhere)
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit(0);
}

// Base URL for ExerciseDB v1 Open Source API
$BASE_URL = 'https://v1.exercisedb.dev/api/v1';

function http_get($url) {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  curl_setopt($ch, CURLOPT_TIMEOUT, 20);
  // Forward basic headers
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json'
  ]);
  $response = curl_exec($ch);
  $errno = curl_errno($ch);
  $error = curl_error($ch);
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return [$response, $httpCode, $errno, $error];
}

function respond_json($data, $status = 200) {
  http_response_code($status);
  echo json_encode($data);
  exit();
}

$action = isset($_GET['action']) ? $_GET['action'] : 'list';
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;

switch ($action) {
  case 'list': {
    // Optional params: search, sortBy, sortOrder
    $params = [
      'offset' => $offset,
      'limit' => $limit
    ];
    if (isset($_GET['search'])) $params['search'] = $_GET['search'];
    if (isset($_GET['sortBy'])) $params['sortBy'] = $_GET['sortBy'];
    if (isset($_GET['sortOrder'])) $params['sortOrder'] = $_GET['sortOrder'];

    $url = $BASE_URL . '/exercises?' . http_build_query($params);
    [$body, $code, $errno, $error] = http_get($url);
    if ($errno) respond_json(['success' => false, 'message' => 'cURL error', 'error' => $error], 500);
    respond_json(json_decode($body, true), $code);
  }
  case 'search': {
    // Required: q, Optional: threshold
    if (!isset($_GET['q'])) respond_json(['success' => false, 'message' => 'Missing required parameter: q'], 400);
    $params = [
      'offset' => $offset,
      'limit' => $limit,
      'q' => $_GET['q']
    ];
    if (isset($_GET['threshold'])) $params['threshold'] = $_GET['threshold'];

    $url = $BASE_URL . '/exercises/search?' . http_build_query($params);
    [$body, $code, $errno, $error] = http_get($url);
    if ($errno) respond_json(['success' => false, 'message' => 'cURL error', 'error' => $error], 500);
    respond_json(json_decode($body, true), $code);
  }
  case 'filter': {
    // Optional: search, muscles (csv), equipment (csv), bodyParts (csv), sortBy, sortOrder
    $params = [
      'offset' => $offset,
      'limit' => $limit
    ];
    $opt = ['search', 'muscles', 'equipment', 'bodyParts', 'sortBy', 'sortOrder'];
    foreach ($opt as $k) if (isset($_GET[$k])) $params[$k] = $_GET[$k];

    $url = $BASE_URL . '/exercises/filter?' . http_build_query($params);
    [$body, $code, $errno, $error] = http_get($url);
    if ($errno) respond_json(['success' => false, 'message' => 'cURL error', 'error' => $error], 500);
    respond_json(json_decode($body, true), $code);
  }
  case 'by_id': {
    if (!isset($_GET['id'])) respond_json(['success' => false, 'message' => 'Missing required parameter: id'], 400);
    $id = urlencode($_GET['id']);
    $url = $BASE_URL . '/exercises/' . $id;
    [$body, $code, $errno, $error] = http_get($url);
    if ($errno) respond_json(['success' => false, 'message' => 'cURL error', 'error' => $error], 500);
    respond_json(json_decode($body, true), $code);
  }
  case 'by_muscle': {
    if (!isset($_GET['muscle'])) respond_json(['success' => false, 'message' => 'Missing required parameter: muscle'], 400);
    $muscle = urlencode($_GET['muscle']);
    $params = [ 'offset' => $offset, 'limit' => $limit ];
    if (isset($_GET['includeSecondary'])) $params['includeSecondary'] = $_GET['includeSecondary'];
    $url = $BASE_URL . '/muscles/' . $muscle . '/exercises?' . http_build_query($params);
    [$body, $code, $errno, $error] = http_get($url);
    if ($errno) respond_json(['success' => false, 'message' => 'cURL error', 'error' => $error], 500);
    respond_json(json_decode($body, true), $code);
  }
  case 'by_bodypart': {
    if (!isset($_GET['bodyPart'])) respond_json(['success' => false, 'message' => 'Missing required parameter: bodyPart'], 400);
    $bodyPart = urlencode($_GET['bodyPart']);
    $params = [ 'offset' => $offset, 'limit' => $limit ];
    $url = $BASE_URL . '/bodyparts/' . $bodyPart . '/exercises?' . http_build_query($params);
    [$body, $code, $errno, $error] = http_get($url);
    if ($errno) respond_json(['success' => false, 'message' => 'cURL error', 'error' => $error], 500);
    respond_json(json_decode($body, true), $code);
  }
  case 'by_equipment': {
    if (!isset($_GET['equipment'])) respond_json(['success' => false, 'message' => 'Missing required parameter: equipment'], 400);
    $equipment = urlencode($_GET['equipment']);
    $params = [ 'offset' => $offset, 'limit' => $limit ];
    $url = $BASE_URL . '/equipments/' . $equipment . '/exercises?' . http_build_query($params);
    [$body, $code, $errno, $error] = http_get($url);
    if ($errno) respond_json(['success' => false, 'message' => 'cURL error', 'error' => $error], 500);
    respond_json(json_decode($body, true), $code);
  }
  default: {
    respond_json(['success' => false, 'message' => 'Unknown action. Supported: list, search, filter, by_id, by_muscle, by_bodypart, by_equipment'], 400);
  }
}
