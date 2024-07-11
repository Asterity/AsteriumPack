use std::path::PathBuf;

use clap::{arg, command, value_parser};

use image::{io::Reader as ImageReader, Rgba};

const OFFSETS: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];

fn main() {
    let matches = command!()
        .arg(
            arg!([imagePath] "Path to the image to process")
                .required(true)
                .value_parser(value_parser!(PathBuf)),
        )
        .get_matches();

    let image_path = matches.get_one::<PathBuf>("imagePath").unwrap();
    println!("Image path: {:?}", image_path);

    let mut image = ImageReader::open(image_path)
        .unwrap()
        .decode()
        .unwrap()
        .to_rgba8();

    let mut pixels_to_remove = vec![];

    for x in 0..image.width() {
        for y in 0..image.height() {
            let pixel = image.get_pixel(x, y);
            if pixel[3] == 0 {
                continue;
            }

            let mut neighbors = 0;
            for offset in OFFSETS {
                let (dx, dy) = offset;

                if x as i32 + dx < 0
                    || y as i32 + dy < 0
                    || x as i32 + dx >= image.width() as i32
                    || y as i32 + dy >= image.height() as i32
                {
                    neighbors += 1;
                    continue;
                }

                let pixel = image.get_pixel((x as i32 + dx) as u32, (y as i32 + dy) as u32);
                if pixel[3] != 0 {
                    neighbors += 1;
                }
            }

            if neighbors == 4 {
                pixels_to_remove.push((x, y));
                println!("Pixel at ({}, {}) is surrounded by opaque pixels", x, y);
            }
        }
    }

    let removed_pixel_count = pixels_to_remove.len();

    for (x, y) in pixels_to_remove {
        image.put_pixel(x, y, Rgba([0, 0, 0, 0]));
    }

    println!("Removed {} pixels", removed_pixel_count);

    image.save(image_path).unwrap();
}
