import { cubicBezier, randomFromInterval } from "./utils";
function generateEyeParameters(width: number, rng: () => number) {
    let height_upper = rng() * width / 1.2;// Less height for the upper eyelid to make it sharper
    let height_lower = rng() * width / 1.2;// More height for the lower eyelid to make it rounder and droopier
    let P0_upper_randX = rng() * 0.4 - 0.2;
    let P3_upper_randX = rng() * 0.4 - 0.2;
    let P0_upper_randY = rng() * 0.4 - 0.2;
    let P3_upper_randY = rng() * 0.4 - 0.2;
    let offset_upper_left_randY = rng();
    let offset_upper_right_randY = rng();
    let P0_upper = [-width / 2 + P0_upper_randX * width / 16, P0_upper_randY * height_upper / 16];
    let P3_upper = [width / 2 + P3_upper_randX * width / 16, P3_upper_randY * height_upper / 16];
    // let P0_lower = P0_upper;// Starting at the same point as the upper eyelid
    // let P3_lower = P3_upper;// Ending at the same point as the upper eyelid
    let eye_true_width = P3_upper[0] - P0_upper[0];

    let offset_upper_left_x = randomFromInterval(-eye_true_width / 10.0, eye_true_width / 2.3, rng);// Upper eyelid control point offset to create asymmetry
    let offset_upper_right_x = randomFromInterval(-eye_true_width / 10.0, eye_true_width / 2.3, rng);// Upper eyelid control point offset to create asymmetry
    let offset_upper_left_y = offset_upper_left_randY * height_upper;// Upper eyelid control point offset to create asymmetry
    let offset_upper_right_y = offset_upper_right_randY * height_upper;// Upper eyelid control point offset to create asymmetry
    let offset_lower_left_x = randomFromInterval(offset_upper_left_x, eye_true_width / 2.1, rng);// Lower eyelid control point offset
    let offset_lower_right_x = randomFromInterval(offset_upper_right_x, eye_true_width / 2.1, rng);// Upper eyelid control point offset to create asymmetry
    let offset_lower_left_y = randomFromInterval(-offset_upper_left_y + 5, height_lower, rng);// Upper eyelid control point offset to create asymmetry
    let offset_lower_right_y = randomFromInterval(-offset_upper_right_y + 5, height_lower, rng);// Upper eyelid control point offset to create asymmetry
    // Generate points for the Bezier curves
    let left_converge0 = rng();
    let right_converge0 = rng();
    // Generate points for the Bezier curves
    let left_converge1 = rng();
    let right_converge1 = rng();
    return {
        height_upper: height_upper,
        height_lower: height_lower,
        P0_upper_randX: P0_upper_randX,
        P3_upper_randX: P3_upper_randX,
        P0_upper_randY: P0_upper_randY,
        P3_upper_randY: P3_upper_randY,
        offset_upper_left_randY: offset_upper_left_randY,
        offset_upper_right_randY: offset_upper_right_randY,
        eye_true_width: eye_true_width,
        offset_upper_left_x: offset_upper_left_x,
        offset_upper_right_x: offset_upper_right_x,
        offset_upper_left_y: offset_upper_left_y,
        offset_upper_right_y: offset_upper_right_y,
        offset_lower_left_x: offset_lower_left_x,
        offset_lower_right_x: offset_lower_right_x,
        offset_lower_left_y: offset_lower_left_y,
        offset_lower_right_y: offset_lower_right_y,
        left_converge0: left_converge0,
        right_converge0: right_converge0,
        left_converge1: left_converge1,
        right_converge1: right_converge1
    }
}

interface Rands {
    P0_upper_randX: number
    P0_upper_randY: number
    height_upper: number
    P3_upper_randX: number
    P3_upper_randY: number
    offset_upper_left_x: number
    offset_upper_left_y: number
    offset_upper_right_x: number
    offset_upper_right_y: number
    offset_lower_left_x: number
    offset_lower_left_y: number
    offset_lower_right_x: number
    offset_lower_right_y: number
    left_converge0: number
    right_converge0: number
    left_converge1: number
    right_converge1: number
}

export function generateEyePoints(rands: Rands, width = 50) {

    let P0_upper = [-width / 2 + rands.P0_upper_randX * width / 16, rands.P0_upper_randY * rands.height_upper / 16];
    let P3_upper = [width / 2 + rands.P3_upper_randX * width / 16, rands.P3_upper_randY * rands.height_upper / 16];
    let P0_lower = P0_upper;// Starting at the same point as the upper eyelid
    let P3_lower = P3_upper;// Ending at the same point as the upper eyelid
    // let eye_true_width = P3_upper[0] - P0_upper[0];

    // Upper eyelid control points
    let P1_upper = [P0_upper[0] + rands.offset_upper_left_x, P0_upper[1] + rands.offset_upper_left_y];  // First control point
    let P2_upper = [P3_upper[0] - rands.offset_upper_right_x, P3_upper[1] + rands.offset_upper_right_y];  // Second control point


    // Lower eyelid control points
    let P1_lower = [P0_lower[0] + rands.offset_lower_left_x, P0_lower[1] - rands.offset_lower_left_y];  // First control point
    let P2_lower = [P3_lower[0] - rands.offset_lower_right_x, P3_lower[1] - rands.offset_lower_right_y];  // Second control point

    // now we generate the points for the upper eyelid
    let upper_eyelid_points = [];
    let upper_eyelid_points_left_control = [];
    let upper_eyelid_points_right_control = [];
    let upper_eyelid_left_control_point = [P0_upper[0] * (1 - rands.left_converge0) + P1_lower[0] * rands.left_converge0, P0_upper[1] * (1 - rands.left_converge0) + P1_lower[1] * rands.left_converge0];
    let upper_eyelid_right_control_point = [P3_upper[0] * (1 - rands.right_converge0) + P2_lower[0] * rands.right_converge0, P3_upper[1] * (1 - rands.right_converge0) + P2_lower[1] * rands.right_converge0];
    for (let t = 0; t < 100; t++) {
        upper_eyelid_points.push(cubicBezier(P0_upper, P1_upper, P2_upper, P3_upper, t / 100));
        upper_eyelid_points_left_control.push(cubicBezier(upper_eyelid_left_control_point, P0_upper, P1_upper, P2_upper, t / 100));
        upper_eyelid_points_right_control.push(cubicBezier(P1_upper, P2_upper, P3_upper, upper_eyelid_right_control_point, t / 100));
    }

    for (let i = 0; i < 75; i++) {
        let weight = ((75.0 - i) / 75.0) ** 2
        upper_eyelid_points[i] = [upper_eyelid_points[i][0] * (1 - weight) + upper_eyelid_points_left_control[i + 25][0] * weight, upper_eyelid_points[i][1] * (1 - weight) + upper_eyelid_points_left_control[i + 25][1] * weight]
        upper_eyelid_points[i + 25] = [upper_eyelid_points[i + 25][0] * weight + upper_eyelid_points_right_control[i][0] * (1 - weight), upper_eyelid_points[i + 25][1] * weight + upper_eyelid_points_right_control[i][1] * (1 - weight)]
    }


    // now we generate the points for the upper eyelid
    let lower_eyelid_points = [];
    let lower_eyelid_points_left_control = [];
    let lower_eyelid_points_right_control = [];
    let lower_eyelid_left_control_point = [P0_lower[0] * (1 - rands.left_converge0) + P1_upper[0] * rands.left_converge0, P0_lower[1] * (1 - rands.left_converge0) + P1_upper[1] * rands.left_converge0];
    let lower_eyelid_right_control_point = [P3_lower[0] * (1 - rands.right_converge1) + P2_upper[0] * rands.right_converge1, P3_lower[1] * (1 - rands.right_converge1) + P2_upper[1] * rands.right_converge1];
    for (let t = 0; t < 100; t++) {
        lower_eyelid_points.push(cubicBezier(P0_lower, P1_lower, P2_lower, P3_lower, t / 100));
        lower_eyelid_points_left_control.push(cubicBezier(lower_eyelid_left_control_point, P0_lower, P1_lower, P2_lower, t / 100));
        lower_eyelid_points_right_control.push(cubicBezier(P1_lower, P2_lower, P3_lower, lower_eyelid_right_control_point, t / 100));
    }

    for (let i = 0; i < 75; i++) {
        let weight = ((75.0 - i) / 75.0) ** 2
        lower_eyelid_points[i] = [lower_eyelid_points[i][0] * (1 - weight) + lower_eyelid_points_left_control[i + 25][0] * weight, lower_eyelid_points[i][1] * (1 - weight) + lower_eyelid_points_left_control[i + 25][1] * weight]
        lower_eyelid_points[i + 25] = [lower_eyelid_points[i + 25][0] * weight + lower_eyelid_points_right_control[i][0] * (1 - weight), lower_eyelid_points[i + 25][1] * weight + lower_eyelid_points_right_control[i][1] * (1 - weight)]
    }
    for (let i = 0; i < 100; i++) {
        lower_eyelid_points[i][1] = -lower_eyelid_points[i][1]
        upper_eyelid_points[i][1] = -upper_eyelid_points[i][1]
    }

    let eyeCenter = [upper_eyelid_points[50][0] / 2.0 + lower_eyelid_points[50][0] / 2.0, upper_eyelid_points[50][1] / 2.0 + lower_eyelid_points[50][1] / 2.0];

    for (let i = 0; i < 100; i++) {
        // translate to center
        lower_eyelid_points[i][0] -= eyeCenter[0]
        lower_eyelid_points[i][1] -= eyeCenter[1]
        upper_eyelid_points[i][0] -= eyeCenter[0]
        upper_eyelid_points[i][1] -= eyeCenter[1]
    }
    eyeCenter = [0, 0];

    // we switch the upper and lower eyelid points because in svg the bottom is y+ and top is y-
    return { upper: upper_eyelid_points, lower: lower_eyelid_points, center: [eyeCenter] }
}

export function generateBothEyes(width = 50, rng: () => number) {
    let rands_left = generateEyeParameters(width, rng)
    // Create a shallow copy of the object
    let rands_right = { ...rands_left } as any;

    // Iterate over the object's keys
    for (let key in rands_right) {
        // Check if the property value is a number
        if (typeof rands_right[key] === 'number') {
            // Add a random value to the number, for example, between -5 and 5
            rands_right[key] += randomFromInterval(-rands_right[key] / 2.0, rands_right[key] / 2.0, rng);
        }
    }
    let left_eye = generateEyePoints(rands_left, width) as any
    let right_eye = generateEyePoints(rands_right, width)

    for (let key in left_eye) {
        if (typeof left_eye[key] === 'object') {
            for (let i = 0; i < left_eye[key].length; i++) {
                left_eye[key][i][0] = -left_eye[key][i][0]
            }
        }
    }
    return { left: left_eye, right: right_eye }
}