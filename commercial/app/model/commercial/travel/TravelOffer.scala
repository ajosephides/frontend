package model.commercial.travel

import akka.util.Timeout
import common.{AkkaAgent, ExecutionContexts, Logging}
import model.commercial._
import org.joda.time.DateTime

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.util.control.NonFatal
import scala.xml.Node

case class TravelOffer(id: String,
                       title: String,
                       offerUrl: String,
                       imageUrl: String,
                       fromPrice: Option[Double],
                       earliestDeparture: DateTime,
                       keywordIdSuffixes: Seq[String],
                       countries: Seq[String],
                       category: Option[String],
                       tags: Seq[String],
                       duration: Option[Int],
                       position: Int) {

  val durationInWords: String = duration match {
    case Some(1) => "1 night"
    case Some(x) => s"$x nights"
    case None => ""
  }

  def formattedPrice : Option[String] = fromPrice map { price =>
    if (price % 1 == 0)
      f"£$price%,.0f"
    else
      f"£$price%,.2f"
  }
}

object TravelOffer {

  def fromXml(xml: Node): TravelOffer = {

    def text(nodeSelector: String): String = (xml \ nodeSelector).text.trim
    def tagText(group: String): Seq[String] = (xml \\ "tag").filter(hasGroupAttr(_, group)).map(_.text.trim)

    def parseInt(s: String) = try {
      Some(s.toInt)
    } catch {
      case NonFatal(_) => None
    }

    def parseDouble(s: String) = try {
      Some(s.toDouble)
    } catch {
      case NonFatal(_) => None
    }

    def hasGroupAttr(elem: Node, value: String) = elem.attribute("group") exists (_.text == value)

    TravelOffer(
      id = text("@vibeid"),
      title = text("name"),
      offerUrl = text("url"),
      imageUrl = text("image"),
      fromPrice = parseDouble(text("@fromprice")),
      earliestDeparture = DateTime.parse(text("@earliestdeparture")),
      keywordIdSuffixes = Nil,
      countries = tagText("Country"),
      category = tagText("Holiday Type").headOption,
      tags = Nil,
      duration = parseInt(text("@duration")),
      position = -1
    )
  }
}

